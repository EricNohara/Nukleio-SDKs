package io.github.ericnohara.nukleio;

import java.util.List;

/** Portfolio data returned by Nukleio. Unknown future JSON properties are ignored. */
public class UserData {
    public String email;
    public String name;
    public String bio;
    public String currentPosition;
    public String currentCompany;
    public String phoneNumber;
    public String currentAddress;
    public String githubUrl;
    public String linkedinUrl;
    public String portraitUrl;
    public String resumeUrl;
    public String transcriptUrl;
    public String facebookUrl;
    public String instagramUrl;
    public String xUrl;
    public List<Skill> skills;
    public List<Experience> experiences;
    public List<Project> projects;
    public List<Education> education;
    public Subscription subscription;

    public static class Skill {
        public String name;
        public Double proficiency;
        public Double yearsOfExperience;
    }

    public static class Experience {
        public String id;
        public String company;
        public String jobTitle;
        public String dateStart;
        public String dateEnd;
        public String jobDescription;
    }

    public static class Project {
        public String name;
        public String dateStart;
        public String dateEnd;
        public List<String> languagesUsed;
        public List<String> frameworksUsed;
        public List<String> technologiesUsed;
        public String description;
        public String githubUrl;
        public String demoUrl;
        public String thumbnailUrl;
    }

    public static class Education {
        public String degree;
        public List<String> majors;
        public List<String> minors;
        public Double gpa;
        public String institution;
        public List<String> awards;
        public Integer yearStart;
        public Integer yearEnd;
        public List<Course> courses;
    }

    public static class Course {
        public String name;
        public String grade;
        public String description;
    }

    public static class Subscription {
        public String status;
        public String priceId;
    }
}
