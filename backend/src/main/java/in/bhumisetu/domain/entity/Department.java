package in.bhumisetu.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // e.g. REVENUE, PLANNING, TREE, UTILITY

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;
}
