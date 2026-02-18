import json
import os
from typing import Any, Dict

LIMITS_FILE = "limits.json"

DEFAULT_LIMITS: Dict[str, Any] = {
    "warning_threshold": 6,
    "critical_threshold": 10,
    "eco_low_max_count": 3,
    "eco_medium_max_count": 6,
    "lighting": {
        "off_percent": 20,
        "low_percent": 60,
        "medium_percent": 80,
        "high_percent": 100,
    },
    "pricing": {
        "base_price": 100,
        "capacity": 50,
        "min_factor": 0.8,
        "max_factor": 1.5,
    },
}

_limits_cache: Dict[str, Any] = {
    "mtime": None,
    "values": DEFAULT_LIMITS,
}


def _to_int(value: Any, default: int, min_value: int = 0) -> int:
    try:
        number = int(value)
        return max(number, min_value)
    except (TypeError, ValueError):
        return default


def _to_float(value: Any, default: float, min_value: float = 0.0) -> float:
    try:
        number = float(value)
        return max(number, min_value)
    except (TypeError, ValueError):
        return default


def _sanitize_limits(raw: Dict[str, Any]) -> Dict[str, Any]:
    warning = _to_int(raw.get("warning_threshold"), DEFAULT_LIMITS["warning_threshold"], 1)
    critical = _to_int(raw.get("critical_threshold"), DEFAULT_LIMITS["critical_threshold"], warning + 1)

    eco_low = _to_int(raw.get("eco_low_max_count"), DEFAULT_LIMITS["eco_low_max_count"], 0)
    eco_medium = _to_int(raw.get("eco_medium_max_count"), DEFAULT_LIMITS["eco_medium_max_count"], eco_low)
    eco_medium = min(eco_medium, warning)

    lighting_raw = raw.get("lighting", {}) if isinstance(raw.get("lighting"), dict) else {}
    lighting = {
        "off_percent": _to_int(lighting_raw.get("off_percent"), DEFAULT_LIMITS["lighting"]["off_percent"], 0),
        "low_percent": _to_int(lighting_raw.get("low_percent"), DEFAULT_LIMITS["lighting"]["low_percent"], 0),
        "medium_percent": _to_int(
            lighting_raw.get("medium_percent"),
            DEFAULT_LIMITS["lighting"]["medium_percent"],
            0,
        ),
        "high_percent": _to_int(lighting_raw.get("high_percent"), DEFAULT_LIMITS["lighting"]["high_percent"], 0),
    }

    pricing_raw = raw.get("pricing", {}) if isinstance(raw.get("pricing"), dict) else {}
    min_factor = _to_float(pricing_raw.get("min_factor"), DEFAULT_LIMITS["pricing"]["min_factor"], 0.0)
    max_factor = _to_float(pricing_raw.get("max_factor"), DEFAULT_LIMITS["pricing"]["max_factor"], min_factor)
    pricing = {
        "base_price": _to_float(pricing_raw.get("base_price"), DEFAULT_LIMITS["pricing"]["base_price"], 0.0),
        "capacity": _to_int(pricing_raw.get("capacity"), DEFAULT_LIMITS["pricing"]["capacity"], 1),
        "min_factor": min_factor,
        "max_factor": max_factor,
    }

    return {
        "warning_threshold": warning,
        "critical_threshold": critical,
        "eco_low_max_count": eco_low,
        "eco_medium_max_count": eco_medium,
        "lighting": lighting,
        "pricing": pricing,
    }


def _get_limits() -> Dict[str, Any]:
    try:
        mtime = os.path.getmtime(LIMITS_FILE)
    except OSError:
        return _limits_cache["values"]

    if _limits_cache["mtime"] == mtime:
        return _limits_cache["values"]

    try:
        with open(LIMITS_FILE, "r", encoding="utf-8") as file:
            raw = json.load(file)
        values = _sanitize_limits(raw if isinstance(raw, dict) else {})
        _limits_cache["mtime"] = mtime
        _limits_cache["values"] = values
        return values
    except (OSError, json.JSONDecodeError):
        return _limits_cache["values"]


def _crowd_level(count: int) -> str:
    limits = _get_limits()
    if count > limits["critical_threshold"]:
        return "CRITICAL"
    if count > limits["warning_threshold"]:
        return "WARNING"
    return "SAFE"


def pricing_engine(count, base_price=None, capacity=None):
    limits = _get_limits()
    pricing = limits["pricing"]

    chosen_base_price = pricing["base_price"] if base_price is None else base_price
    chosen_capacity = pricing["capacity"] if capacity is None else capacity

    if chosen_capacity <= 0:
        return round(chosen_base_price, 2)

    occupancy = max(0.0, count / chosen_capacity)
    demand_factor = pricing["min_factor"] + min(occupancy, 1.0) * (pricing["max_factor"] - pricing["min_factor"])

    return round(chosen_base_price * demand_factor, 2)


def energy_controller(count):
    limits = _get_limits()
    lighting = limits["lighting"]

    if count == 0:
        return f"ECO MODE (Lights {lighting['off_percent']}%)"
    if count <= limits["eco_low_max_count"]:
        return f"ECO MODE (Lights {lighting['low_percent']}%)"
    if count <= limits["eco_medium_max_count"]:
        return f"ECO MODE (Lights {lighting['medium_percent']}%)"
    return f"NORMAL (Lights {lighting['high_percent']}%)"


def safety_check(count):
    return _crowd_level(count)
