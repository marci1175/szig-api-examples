/// Create a type we can serialize into.
/// Represents all of the lessons.
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct LessonTimes {
    lessontimes: Vec<Lesson>
}

/// Create a type we can serialize into.
/// Represents a lesson entry.
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Lesson {
    name: i32,
    start: String,
    end: String,
}

/// Data type representing the whole year.
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Calendar {
    dates: Vec<Day>,
}

/// Data type representing a day in the calendar.
/// If there are no events the `events` field is [`std::option::Option::None`].
/// If the day is not a school day the `school_day` field is [`std::option::Option::None`] else it counts which school day it is in the year.
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Day {
    date: String,
    events: Option<String>,
    school_day: Option<i32>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get lessiontimes
    let lessontimes_req = reqwest::get("https://ujbudaiszechenyi.hu/api/lessontimes").await?;
    let lessontimes_text = lessontimes_req.text().await?;

    // Plain text
    println!("Plaintext format:\n{lessontimes_text}");

    //Serialized format
    let lesson_times_ser = serde_json::from_str::<LessonTimes>(&lessontimes_text)?;

    println!("Serialized format:");
    
    // We call debug so we can really show it is serialized lol
    dbg!(lesson_times_ser);

    // Get calendar
    let calendar_req = reqwest::get("https://ujbudaiszechenyi.hu/api/calendar").await?;
    let calendar_text = calendar_req.text().await?;

    println!("Plaintext format: {calendar_text}");
    
    let lesson_times_ser = serde_json::from_str::<Calendar>(&calendar_text)?;

    println!("Serialized format:");
    dbg!(lesson_times_ser);

    Ok(())
}
