package in.bhumisetu.domain.enums;

public enum DocumentType {
    EXTRACT_7_12("7/12 Satbara Extract"),
    MUTATION_8_A("8-A Land Holding Extract"),
    SALE_DEED("Registered Sale Deed"),
    BUILDING_PLAN("Sanctioned Building Plan"),
    NON_AGRICULTURAL_ORDER("NA Conversion Order"),
    NOC_TREE_AUTHORITY("Tree Authority NOC"),
    TAX_RECEIPT("Property Tax Receipt"),
    ENCUMBRANCE_CERTIFICATE("Encumbrance Certificate");

    private final String title;

    DocumentType(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }
}
