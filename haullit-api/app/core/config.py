from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://haullit:haullit@localhost:5432/haullit"
    session_secret: str = "dev-secret-change-me"
    cors_origins: list[str] = ["http://localhost:3000"]

    shipping_flat_cents: int = 495
    bank_iban: str = ""
    bank_holder: str = ""
    bizum_phone: str = ""


settings = Settings()
