# Spelling App - Complete Documentation

## Overview
An automated spelling practice app that speaks weekly spelling words and allows children to type their answers. The system tracks attempts and provides feedback on accuracy.

---

## System Architecture

### Components
1. **Airtable** - Database storing words and tracking attempts
2. **Make.com** - Automation platform (2 scenarios)
3. **OpenAI TTS** - Text-to-speech API
4. **Dropbox** - Audio file storage
5. **HTML/React App** - Child-facing interface

### Account Information
- Make.com: crispydunn@gmail.com
- Dropbox: crispydunn@gmail.com (https://www.dropbox.com/home/elevenlabs_audio)
- OpenAI: crispydunn@gmail.com (https://platform.openai.com/)
- Airtable: crispydunn@gmail.com (https://airtable.com/)

---

## Airtable Structure

### Table 1: Weekly_Words
Stores the spelling words for each week with their audio files.

| Field Name | Type | Description |
|------------|------|-------------|
| Word | Single line text | The spelling word |
| Week | Number | Week number (1, 2, 3, etc.) |
| Audio File | Attachment | MP3 file of word pronunciation |
| Notes | Long text | Optional notes about the word |
| Attempts | Linked record | Links to Attempts table |
| Created Time | Created time | Auto-populated timestamp |

### Table 2: Attempts
Records each spelling attempt made by the child.

| Field Name | Type | Description |
|------------|------|-------------|
| Attempt ID | Autonumber | Unique identifier |
| Child's Name | Single line text | Name of the child |
| Word | Linked record | Links to Weekly_Words table |
| Week | Lookup | Pulls week number from linked Word |
| Typed Answer | Single line text | What the child typed |
| Attachment Summary | Long text | LLM-generated summary |
| Correct Word | Lookup | Pulls correct spelling from Weekly_Words |
| Correct | Formula | `IF({Typed Answer} = {Correct Word}, "Correct", "Incorrect")` |
| Errors | Number | Count of letter differences |
| Date | Created time | Auto-populated timestamp |
| Status | Single select | "Checked" or "Not Checked" |
| Word Audio | Lookup | Pulls audio file from Weekly_Words |

---

## Make.com Workflows

### Scenario 1: Audio File Creation
**Purpose:** Automatically creates audio pronunciation files when new words are added to Airtable.

**Trigger:** When words are added or updated in Weekly_Words table

#### Module Flow:

1. **Airtable: Watch Records**
   - Table: Weekly_Words
   - Trigger field: Word
   - Watches for new or updated records

2. **HTTP: Make a Request (OpenAI TTS)**
   - URL: `https://api.openai.com/v1/audio/speech`
   - Method: POST
   - Headers: 
     - `Authorization`: `Bearer [OpenAI API key]`
     - `Content-Type`: `application/json`
   - Authentication type: No auth
   - Body type: Application/json
   - Body input method: JSON string
   - Body:
     ```json
     {
       "model": "tts-1",
       "input": "{{1.Word}}",
       "voice": "nova",
       "response_format": "mp3"
     }
     ```
   - Parse response: No (returns raw audio data)
   - **Cost:** ~$0.06/year at typical usage (~336 characters/month)
   - Returns: MP3 audio data directly

3. **Dropbox: Upload a File**
   - Folder: /elevenlabs_audio
   - File name: `{{1.Word}}.mp3`
   - Data: `{{2.data}}` (raw audio from OpenAI)
   - Creates the audio file in Dropbox

4. **Dropbox: Create/Update a Share Link**
   - Path: `/elevenlabs_audio/{{1.Word}}.mp3`
   - Creates publicly accessible link

5. **Airtable: Update a Record**
   - Table: Weekly_Words
   - Record ID: `{{1.id}}`
   - Audio File field:
     - File URL: `{{replace(13.downloadUrl; "dl=0"; "dl=1")}}`
     - File name: `{{13.name}}.mp3`
   - Updates the original record with the audio file

**Result:** Word in Airtable now has an MP3 file attached that can be played.

---

### Scenario 2: Get Words for App
**Purpose:** Provides the app with words for a specific week when requested.

**Trigger:** Webhook receives request from the app

#### Module Flow:

1. **Webhooks: Custom Webhook**
   - Name: "Get Words"
   - Receives: `{ "week": <number> }` or `{ "week": "latest" }`
   - Returns webhook URL for the app to call

2. **Airtable: Search Records**
   - Table: Weekly_Words
   - Formula: `IF({{1.week}} = "latest", {Week} = MAX({Week}), {Week} = {{1.week}})`
   - Limit: 12
   - Returns all words for the requested week

3. **Tools: Text Aggregator**
   - Source Module: Airtable - Search Records [2]
   - Text:
     ```json
     {
       "id": "{{2.id}}",
       "word": "{{2.Word}}",
       "audioUrl": "{{2.`Audio File`[].url}}"
     }
     ```
   - Row separator: Other
   - Separator: `,`
   - Combines all word records into a comma-separated list

4. **Webhooks: Webhook Response**
   - Status: 200
   - Body:
     ```json
     {
       "words": [ {{7.text}} ]
     }
     ```
   - Returns JSON array of words to the app

**Result:** App receives an array of 12 words with their IDs, spellings, and audio URLs.

---

## The Spelling App (HTML/React)

### File Location
Saved as HTML file on laptop (location: [FILL IN])

### How It Works

1. **Start Screen:**
   - Child enters their name
   - Selects which week to practice (current or previous weeks)
   - Clicks "Start Practicing"

2. **App Fetches Words:**
   - Calls Scenario 2 webhook
   - Receives 12 words for selected week
   - Shuffles them randomly

3. **Practice Loop (for each word):**
   - Plays audio pronunciation automatically
   - Child can replay audio with "Listen to Word" button
   - Child types their spelling attempt
   - Clicks "Check Spelling"

4. **Answer Submission:**
   - App creates a record in Airtable's Attempts table with:
     - Child's name
     - Link to the word record
     - Typed answer
     - Status: "Checked"
   - Airtable formulas automatically calculate:
     - Whether answer is correct
     - Number of letter errors

5. **Feedback Display:**
   - Shows ✅ Correct or ❌ Incorrect
   - If incorrect, shows:
     - Number of letters wrong
     - What they typed
     - Correct spelling
   - Tracks score (X/12)

6. **Completion:**
   - After all 12 words, shows final score
   - Option to practice again

### Key Configuration

The app requires three values to be configured in the code:

```javascript
const WEBHOOK_GET_WORDS = 'YOUR_MAKE_WEBHOOK_URL_HERE';
const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
const AIRTABLE_BASE_ID = 'YOUR_AIRTABLE_BASE_ID';
```

**Current values:** [FILL IN FOR SECURITY]

---

## How to Use

### Adding New Words

1. Go to Airtable → Weekly_Words table
2. Add new row with:
   - Word: The spelling word
   - Week: Week number (e.g., 5)
   - Notes: (optional)
3. Save
4. Scenario 1 automatically:
   - Generates audio pronunciation
   - Saves to Dropbox
   - Updates record with audio file
5. Within ~30 seconds, audio file appears in the record

### Adding a New Week

When you start a new week in Airtable, the app's week selector buttons need to be updated manually — they are driven by a word list embedded in the app, not fetched live from Airtable.

**Step 1: Add the new week's words to Airtable**
1. Go to Airtable → Weekly_Words table
2. Add each word as a new row with the correct Week number (e.g., 4)
3. Make.com Scenario 1 will automatically generate audio for each word within ~30 seconds

**Step 2: Add the same words to the app's mock bank**
1. Open `index.html` from the [spelling-app GitHub repo](https://github.com/CrispyShine/spelling-app)
2. Find the `<script id="mock-words">` block near the bottom of the file
3. Add a new week entry following the same pattern as existing weeks:
```json
"4": [
  {"recordId":"w4_01","word":"example"},
  {"recordId":"w4_02","word":"another"},
  ...
]
```
4. Save the file and push to GitHub — the new week button will appear on the app within ~1 minute

**Note:** The `recordId` values are arbitrary labels (e.g., `w4_01`) — they just need to be unique within the file. The mock bank is used when the app is in Sample mode and to drive the week selector buttons in both modes.

---

### Running the App

1. Open the HTML file on laptop
2. Child enters their name
3. Select week to practice
4. Click "Start Practicing"
5. Listen and type each word
6. Review results at the end

### Reviewing Attempts

1. Go to Airtable → Attempts table
2. View all attempts with:
   - Which child
   - Which word
   - What they typed
   - Whether correct
   - Number of errors
   - Date/time

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ ADDING WORDS (Scenario 1)                                    │
└─────────────────────────────────────────────────────────────┘

Add word to Airtable
        ↓
Make.com watches for new records
        ↓
Sends word to ElevenLabs API
        ↓
Receives MP3 audio
        ↓
Uploads to Dropbox
        ↓
Creates share link
        ↓
Updates Airtable record with audio file


┌─────────────────────────────────────────────────────────────┐
│ USING THE APP (Scenario 2)                                   │
└─────────────────────────────────────────────────────────────┘

Child opens app and selects week
        ↓
App calls Make.com webhook
        ↓
Make.com searches Airtable for week's words
        ↓
Aggregates word data (id, word, audioUrl)
        ↓
Returns JSON array to app
        ↓
App displays word interface
        ↓
Plays audio → Child types → Clicks check
        ↓
App creates record in Attempts table
        ↓
Airtable formulas calculate correctness
        ↓
App fetches result and shows feedback
        ↓
Repeat for all 12 words
        ↓
Show final score
```

---

## Troubleshooting

### Audio files not generating
- Check Make.com Scenario 1 is active and scheduled
- Verify OpenAI API key is valid (https://platform.openai.com/api-keys)
- Check OpenAI account has payment method and credits
- Check Dropbox connection in Make.com
- Look at Make.com execution history for errors
- Verify you haven't hit OpenAI usage limit (very unlikely)

### App not loading words
- Check Make.com Scenario 2 is active
- Verify webhook URL is correct in app code
- Test webhook by visiting URL directly
- Check Airtable has words for that week

### "422 Error" when updating Airtable
- Verify Airtable API key is valid
- Check Base ID is correct
- Ensure Audio File field is Attachment type
- Verify URL format has `dl=1` not `dl=0`

### Words not playing audio
- Check audio file exists in Airtable record
- Verify Dropbox link is public
- Ensure link ends with `dl=1`
- Test link directly in browser

### App shows wrong week
- Verify Week field in Airtable is Number type
- Check formula in Scenario 2 Search Records
- Ensure weeks are numbered correctly (1, 2, 3...)

---

## Child's Suggestions for Improvement
[DOCUMENT THEIR FEEDBACK HERE]

---

## Maintenance Notes

### Weekly Tasks
- Add new words to Airtable for upcoming week
- Verify audio files generated successfully
- Check previous week's attempt data

### Monthly Tasks
- Review Make.com operation count (free tier limit)
- Check Dropbox storage usage
- Archive old attempt records if needed

### Important Notes
- Free tier limits: Monitor usage to avoid disruption
- Backup Airtable data regularly
- Keep API keys secure and private
- Document any changes to formulas or structures

---

## Version History
- Initial build: [11-2025]
- Documentation created: [24-04-2026]
- Last updated: [25-04-2026] — redesigned UI deployed to GitHub Pages; name prompt added; week selector and word count made dynamic; mock bank trimmed to 3 weeks
