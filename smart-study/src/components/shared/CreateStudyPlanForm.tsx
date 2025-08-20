"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudyPlanFormData } from "../../types/types";

interface CreateStudyPlanFormProps {
  onSubmit: (data: StudyPlanFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
  initialData?: StudyPlanFormData;
  mode?: "create" | "edit";
  title?: string;
}

const CreateStudyPlanForm: React.FC<CreateStudyPlanFormProps> = ({
  onSubmit,
  onCancel,
  isOpen,
  initialData,
  mode = "create",
  title,
}) => {
  const emptyForm: StudyPlanFormData = {
    title: "",
    description: "",
    duration: "",
    subjects: [],
    difficulty: "Beginner",
    studyHoursPerWeek: 5,
    startDate: "",
    goals: [],
    prerequisites: [],
  };

  const [formData, setFormData] = useState<StudyPlanFormData>(initialData || emptyForm);

  // Prefill in edit mode or when initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  const [currentSubject, setCurrentSubject] = useState("");
  const [currentGoal, setCurrentGoal] = useState("");
  const [currentPrerequisite, setCurrentPrerequisite] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
  const durationOptions = [
    "4 weeks",
    "6 weeks",
    "8 weeks",
    "12 weeks",
    "16 weeks",
    "20 weeks",
    "24 weeks",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "studyHoursPerWeek" ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addSubject = () => {
    if (
      currentSubject.trim() &&
      !formData.subjects.includes(currentSubject.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, currentSubject.trim()],
      }));
      setCurrentSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }));
  };

  const addGoal = () => {
    if (currentGoal.trim() && !formData.goals.includes(currentGoal.trim())) {
      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, currentGoal.trim()],
      }));
      setCurrentGoal("");
    }
  };

  const removeGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g !== goal),
    }));
  };

  const addPrerequisite = () => {
    if (
      currentPrerequisite.trim() &&
      !formData.prerequisites.includes(currentPrerequisite.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, currentPrerequisite.trim()],
      }));
      setCurrentPrerequisite("");
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== prerequisite),
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = "At least one subject is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (formData.studyHoursPerWeek < 1 || formData.studyHoursPerWeek > 40) {
      newErrors.studyHoursPerWeek = "Study hours must be between 1 and 40";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        description: "",
        duration: "",
        subjects: [],
        difficulty: "Beginner",
        studyHoursPerWeek: 5,
        startDate: "",
        goals: [],
        prerequisites: [],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{title || (mode === "edit" ? "Edit Study Plan" : "Create Study Plan")}</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Plan Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Master Machine Learning Fundamentals"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you'll learn and achieve with this study plan..."
                  rows={3}
                  className={`w-full p-3 border rounded-md resize-none ${
                    errors.description ? "border-red-500" : "border-input"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium mb-2"
                  >
                    Duration *
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md ${
                      errors.duration ? "border-red-500" : "border-input"
                    }`}
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.duration && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium mb-2"
                  >
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md border-input"
                  >
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="studyHoursPerWeek"
                    className="block text-sm font-medium mb-2"
                  >
                    Study Hours per Week *
                  </label>
                  <Input
                    id="studyHoursPerWeek"
                    name="studyHoursPerWeek"
                    type="number"
                    min="1"
                    max="40"
                    value={formData.studyHoursPerWeek}
                    onChange={handleInputChange}
                    className={errors.studyHoursPerWeek ? "border-red-500" : ""}
                  />
                  {errors.studyHoursPerWeek && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.studyHoursPerWeek}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium mb-2"
                  >
                    Start Date *
                  </label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subjects *</h3>
              <div className="flex space-x-2">
                <Input
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  placeholder="Add a subject (e.g., Linear Algebra)"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSubject())
                  }
                />
                <Button type="button" onClick={addSubject} variant="outline">
                  Add
                </Button>
              </div>
              {errors.subjects && (
                <p className="text-sm text-red-500">{errors.subjects}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="ml-2 text-primary/70 hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Learning Goals</h3>
              <div className="flex space-x-2">
                <Input
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  placeholder="Add a learning goal"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addGoal())
                  }
                />
                <Button type="button" onClick={addGoal} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.goals.map((goal) => (
                  <span
                    key={goal}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Prerequisites</h3>
              <div className="flex space-x-2">
                <Input
                  value={currentPrerequisite}
                  onChange={(e) => setCurrentPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addPrerequisite())
                  }
                />
                <Button
                  type="button"
                  onClick={addPrerequisite}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prerequisite) => (
                  <span
                    key={prerequisite}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                  >
                    {prerequisite}
                    <button
                      type="button"
                      onClick={() => removePrerequisite(prerequisite)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                {mode === "edit" ? "Save Changes" : "Create Study Plan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudyPlanForm;
