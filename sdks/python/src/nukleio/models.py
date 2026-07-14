from __future__ import annotations

from typing import TypedDict


class Skill(TypedDict):
    name: str
    proficiency: float | None
    years_of_experience: float | None


class Experience(TypedDict):
    id: str
    company: str
    job_title: str
    date_start: str | None
    date_end: str | None
    job_description: str | None


class Project(TypedDict):
    name: str
    date_start: str
    date_end: str
    languages_used: list[str] | None
    frameworks_used: list[str] | None
    technologies_used: list[str] | None
    description: str
    github_url: str | None
    demo_url: str | None
    thumbnail_url: str | None


class Course(TypedDict):
    name: str
    grade: str | None
    description: str | None


class Education(TypedDict):
    degree: str
    majors: list[str]
    minors: list[str]
    gpa: float | None
    institution: str
    awards: list[str]
    year_start: int | None
    year_end: int | None
    courses: list[Course]


class Subscription(TypedDict):
    status: str | None
    price_id: str | None


class UserData(TypedDict):
    email: str
    name: str | None
    bio: str | None
    current_position: str | None
    current_company: str | None
    phone_number: str | None
    current_address: str | None
    github_url: str | None
    linkedin_url: str | None
    portrait_url: str | None
    resume_url: str | None
    transcript_url: str | None
    facebook_url: str | None
    instagram_url: str | None
    x_url: str | None
    skills: list[Skill]
    experiences: list[Experience]
    projects: list[Project]
    education: list[Education]
    subscription: Subscription | None
