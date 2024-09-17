# Habr Freelance task notifier telegram bot

## Description
This is a Telegram bot that monitors freelance tasks on Habr and notifies users about new tasks based on their specified filters. Users can add, remove, and list their filters, allowing for customized notifications tailored to their interests.

## Features
- Add filters for categories and search queries.
- Remove existing filters.
- List all active filters.
- Receive notifications about new tasks that match the filters.

## Prerequisites
- Node.js (version 20 or higher)
- A Telegram Bot Token (you can create one using [BotFather](https://core.telegram.org/bots#botfather))

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/slavamak/habr-freelance-bot.git
    cd habr-freelance-bot
    ```

2. **Install dependencies**:
    ```bash
    pnpm install
    ```

3. **Create a `.env` file** in the root directory and add your bot token:
    ```plaintext
    BOT_TOKEN=your_bot_token_here
    ```

## Running the Bot

To start the bot, run the following command:
```bash
pnpm dev
```

The bot will start running and will check for new tasks every 60 seconds.

## Docker Support

If you prefer to run the bot in a Docker container, run the following command:
```bash
docker compose up --build -d
```

## Commands
- `/start` - Start interacting with the bot.
- `/add_filter <category> <query>` - Add a new filter for tasks.
- `/remove_filter <filter_index>` - Remove a filter by its index.
- `/list_filters` - List all active filters.
- `/help` - Get help about using the bot.

## License
This project is licensed under the MIT License.
