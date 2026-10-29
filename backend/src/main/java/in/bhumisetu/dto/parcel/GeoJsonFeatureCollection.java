package in.bhumisetu.dto.parcel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeoJsonFeatureCollection {

    @Builder.Default
    private String type = "FeatureCollection";

    @Builder.Default
    private List<GeoJsonFeature> features = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeoJsonFeature {
        @Builder.Default
        private String type = "Feature";
        private Object id;
        private GeoJsonGeometry geometry;
        private Map<String, Object> properties;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeoJsonGeometry {
        private String type; // "Polygon"
        private Object coordinates; // List<List<List<Double>>>
    }
}
