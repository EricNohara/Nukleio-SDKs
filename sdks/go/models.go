package nukleio

// UserData is the portfolio data returned by Nukleio.
type UserData struct {
	Email           string        `json:"email"`
	Name            *string       `json:"name"`
	Bio             *string       `json:"bio"`
	CurrentPosition *string       `json:"current_position"`
	CurrentCompany  *string       `json:"current_company"`
	PhoneNumber     *string       `json:"phone_number"`
	CurrentAddress  *string       `json:"current_address"`
	GitHubURL       *string       `json:"github_url"`
	LinkedInURL     *string       `json:"linkedin_url"`
	PortraitURL     *string       `json:"portrait_url"`
	ResumeURL       *string       `json:"resume_url"`
	TranscriptURL   *string       `json:"transcript_url"`
	FacebookURL     *string       `json:"facebook_url"`
	InstagramURL    *string       `json:"instagram_url"`
	XURL            *string       `json:"x_url"`
	Skills          []Skill       `json:"skills"`
	Experiences     []Experience  `json:"experiences"`
	Projects        []Project     `json:"projects"`
	Education       []Education   `json:"education"`
	Subscription    *Subscription `json:"subscription"`
}

type Skill struct {
	Name              string   `json:"name"`
	Proficiency       *float64 `json:"proficiency"`
	YearsOfExperience *float64 `json:"years_of_experience"`
}

type Experience struct {
	ID             string  `json:"id"`
	Company        string  `json:"company"`
	JobTitle       string  `json:"job_title"`
	DateStart      *string `json:"date_start"`
	DateEnd        *string `json:"date_end"`
	JobDescription *string `json:"job_description"`
}

type Project struct {
	Name             string    `json:"name"`
	DateStart        string    `json:"date_start"`
	DateEnd          string    `json:"date_end"`
	LanguagesUsed    *[]string `json:"languages_used"`
	FrameworksUsed   *[]string `json:"frameworks_used"`
	TechnologiesUsed *[]string `json:"technologies_used"`
	Description      string    `json:"description"`
	GitHubURL        *string   `json:"github_url"`
	DemoURL          *string   `json:"demo_url"`
	ThumbnailURL     *string   `json:"thumbnail_url"`
}

type Education struct {
	Degree      string   `json:"degree"`
	Majors      []string `json:"majors"`
	Minors      []string `json:"minors"`
	GPA         *string  `json:"gpa"`
	Institution string   `json:"institution"`
	Awards      []string `json:"awards"`
	YearStart   *int     `json:"year_start"`
	YearEnd     *int     `json:"year_end"`
	Courses     []Course `json:"courses"`
}

type Course struct {
	Name        string  `json:"name"`
	Grade       *string `json:"grade"`
	Description *string `json:"description"`
}

type Subscription struct {
	Status  *string `json:"status"`
	PriceID *string `json:"price_id"`
}
