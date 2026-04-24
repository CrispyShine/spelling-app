# Kids Spelling App

An automated spelling practice application that helps children learn their weekly spelling words through audio pronunciation and interactive practice.

## Features

- 🔊 Text-to-speech audio for each word
- ✍️ Interactive spelling practice interface
- 📊 Automatic tracking of attempts and accuracy
- 🎯 Weekly word organization
- 📈 Progress monitoring

## Tech Stack

- **Frontend:** HTML/React
- **Database:** Airtable
- **Automation:** Make.com
- **TTS:** OpenAI Text-to-Speech API
- **Storage:** Dropbox

## How It Works

1. Add spelling words to Airtable
2. Make.com automation generates audio pronunciations via OpenAI TTS
3. Audio files stored in Dropbox
4. Child uses web app to practice spelling
5. Attempts tracked in Airtable with automatic correctness checking

## Cost

Extremely low cost operation:
- OpenAI TTS: ~$0.06/year for typical usage
- Airtable: Free tier
- Make.com: Free tier
- Dropbox: Free tier

## Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Documentation

Full system documentation available in [DOCUMENTATION.md](DOCUMENTATION.md)

## License

MIT License