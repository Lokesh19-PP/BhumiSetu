package in.bhumisetu.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Initializes H2GIS spatial functions BEFORE JPA/Hibernate creates the schema.
 * This is critical because Hibernate needs H2GIS functions available when
 * creating geometry columns with create-drop.
 */
@Configuration
@Profile("dev")
@Slf4j
public class H2GisInitializer {

    @Bean
    public DataSource dataSource(DataSourceProperties properties) throws Exception {
        DataSource dataSource = properties.initializeDataSourceBuilder().build();

        // Initialize H2GIS spatial functions before Hibernate runs
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE ALIAS IF NOT EXISTS H2GIS_SPATIAL FOR \"org.h2gis.functions.factory.H2GISFunctions.load\"");
            stmt.execute("CALL H2GIS_SPATIAL()");
            log.info("H2GIS spatial functions initialized successfully for dev profile.");
        }

        return dataSource;
    }
}
