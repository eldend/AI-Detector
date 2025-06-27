import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// A simple function to generate a summary from events
function generatePromptInput(events: any[]): string {
  const summary = events
    .map((event) => {
      switch (event.event_type) {
        case "process_creation":
          return `${event.process_name} 생성`;
        case "network_connection":
          return `네트워크 연결 (${event.destination_ip})`;
        case "registry_modification":
          return `레지스트리 수정`;
        case "file_write":
          return `파일 쓰기 (${event.file_path})`;
        default:
          return event.event_type;
      }
    })
    .slice(0, 3); // Show up to 3 events for brevity

  return summary.join(" → ");
}

export async function GET() {
  try {
    // Get the path to the JSON file in the backend directory
    const jsonPath = path.resolve(
      process.cwd(),
      "..",
      "backend",
      "otel_traces_sample.json"
    );
    const jsonData = await fs.readFile(jsonPath, "utf-8");
    let traces = JSON.parse(jsonData);

    // Add prompt_input to each trace
    traces = traces.map((trace: any) => ({
      ...trace,
      prompt_input: generatePromptInput(trace.events),
    }));

    // We'll simulate a network delay.
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(traces);
  } catch (error) {
    console.error("Failed to read or parse trace data:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to load trace data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
