
def pricing_engine(count, base_price=100, capacity=50):
    if capacity == 0: return base_price
    occupancy = count / capacity
    if occupancy > 0.9:
        demand_factor = 1.5 
    elif occupancy > 0.7:
        demand_factor = 1.2
    elif occupancy > 0.5:
        demand_factor = 1.0 
    else:
        demand_factor = 0.8 

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