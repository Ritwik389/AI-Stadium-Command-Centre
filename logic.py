
def pricing_engine(count, base_price=100, capacity=50):
    if capacity <= 0:
        return round(base_price, 2)

    # Continuous pricing so changes in count are reflected immediately.
    occupancy = max(0.0, count / capacity)
    demand_factor = 0.8 + min(occupancy, 1.0) * 0.7  # 0.8x -> 1.5x

    return round(base_price * demand_factor, 2)

def energy_controller(count):

    if count == 0:
        return "ECO MODE (Lights 20%)"
    elif count<=5:
        return "ECO MODE (Lights 60%)"
    elif count <=10:
        return "ECO MODE (Lights 80%)"
    return "NORMAL (Lights 100%)"

def safety_check(count):

    if count > 15:
        return "CRITICAL"
    elif count > 10:
        return "WARNING"
    
    return "SAFE"
