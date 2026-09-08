from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://haullit:haullit@localhost:5432/haullit"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    session_secret: str = "dev-secret-change-me"
    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
