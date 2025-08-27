package com.studymate.repository;

import com.studymate.entity.CoursePdfEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CoursePdfRepository extends JpaRepository<CoursePdfEntity, UUID> {
}
