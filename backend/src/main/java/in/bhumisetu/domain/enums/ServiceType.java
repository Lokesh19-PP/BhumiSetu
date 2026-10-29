package in.bhumisetu.domain.enums;

public enum ServiceType {
    BUILDING_PERMISSION("Building Permission", "PLANNING"),
    LAND_USE_CHANGE("Land-Use Change (NA Conversion)", "REVENUE"),
    WATER_CONNECTION("Water & Sewerage Connection", "UTILITY");

    private final String displayName;
    private final String departmentCode;

    ServiceType(String displayName, String departmentCode) {
        this.displayName = displayName;
        this.departmentCode = departmentCode;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }
}
