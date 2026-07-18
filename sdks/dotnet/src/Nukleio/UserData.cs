namespace Nukleio;

/// <summary>Portfolio data returned by Nukleio.</summary>
public sealed class UserData
{
    public string Email { get; init; } = string.Empty;
    public string? Name { get; init; }
    public string? Bio { get; init; }
    public string? CurrentPosition { get; init; }
    public string? CurrentCompany { get; init; }
    public string? PhoneNumber { get; init; }
    public string? CurrentAddress { get; init; }
    public string? GithubUrl { get; init; }
    public string? LinkedinUrl { get; init; }
    public string? PortraitUrl { get; init; }
    public string? ResumeUrl { get; init; }
    public string? TranscriptUrl { get; init; }
    public string? FacebookUrl { get; init; }
    public string? InstagramUrl { get; init; }
    public string? XUrl { get; init; }
    public IReadOnlyList<Skill> Skills { get; init; } = [];
    public IReadOnlyList<Experience> Experiences { get; init; } = [];
    public IReadOnlyList<Project> Projects { get; init; } = [];
    public IReadOnlyList<Education> Education { get; init; } = [];
    public Subscription? Subscription { get; init; }
}

public sealed class Skill
{
    public string Name { get; init; } = string.Empty;
    public double? Proficiency { get; init; }
    public double? YearsOfExperience { get; init; }
}

public sealed class Experience
{
    public string Id { get; init; } = string.Empty;
    public string Company { get; init; } = string.Empty;
    public string JobTitle { get; init; } = string.Empty;
    public string? DateStart { get; init; }
    public string? DateEnd { get; init; }
    public string? JobDescription { get; init; }
}

public sealed class Project
{
    public string Name { get; init; } = string.Empty;
    public string DateStart { get; init; } = string.Empty;
    public string DateEnd { get; init; } = string.Empty;
    public IReadOnlyList<string>? LanguagesUsed { get; init; }
    public IReadOnlyList<string>? FrameworksUsed { get; init; }
    public IReadOnlyList<string>? TechnologiesUsed { get; init; }
    public string Description { get; init; } = string.Empty;
    public string? GithubUrl { get; init; }
    public string? DemoUrl { get; init; }
    public string? ThumbnailUrl { get; init; }
}

public sealed class Education
{
    public string Degree { get; init; } = string.Empty;
    public IReadOnlyList<string> Majors { get; init; } = [];
    public IReadOnlyList<string> Minors { get; init; } = [];
    public string? Gpa { get; init; }
    public string Institution { get; init; } = string.Empty;
    public IReadOnlyList<string> Awards { get; init; } = [];
    public int? YearStart { get; init; }
    public int? YearEnd { get; init; }
    public IReadOnlyList<Course> Courses { get; init; } = [];
}

public sealed class Course
{
    public string Name { get; init; } = string.Empty;
    public string? Grade { get; init; }
    public string? Description { get; init; }
}

public sealed class Subscription
{
    public string? Status { get; init; }
    public string? PriceId { get; init; }
}
