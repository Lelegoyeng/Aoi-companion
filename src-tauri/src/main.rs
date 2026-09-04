use tauri::Manager;
use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Halo, {}! Aoi di sini~", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_always_on_top(true)?;

            let mut positioned = false;

            if let Ok(Some(monitor)) = window.primary_monitor() {
                let size = monitor.size();
                let scale = monitor.scale_factor();
                let screen_w = size.width as f64 / scale;
                let screen_h = size.height as f64 / scale;
                let x = screen_w - 350.0;
                let y = screen_h - 520.0;
                let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition::new(x, y)));
                positioned = true;
            }

            if !positioned {
                if let Ok(monitors) = window.available_monitors() {
                    if let Some(monitor) = monitors.first() {
                        let size = monitor.size();
                        let scale = monitor.scale_factor();
                        let screen_w = size.width as f64 / scale;
                        let screen_h = size.height as f64 / scale;
                        let x = screen_w - 350.0;
                        let y = screen_h - 520.0;
                        let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition::new(x, y)));
                        positioned = true;
                    }
                }
            }

            if !positioned {
                let win = window.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(500));
                    if let Ok(out) = Command::new("xdotool").args(["getdisplaygeometry"]).output() {
                        let geo = String::from_utf8_lossy(&out.stdout);
                        let parts: Vec<&str> = geo.trim().split_whitespace().collect();
                        if parts.len() >= 2 {
                            if let (Ok(sw), Ok(sh)) = (parts[0].parse::<i32>(), parts[1].parse::<i32>()) {
                                let x = sw - 350;
                                let y = sh - 520;
                                let _ = Command::new("xdotool")
                                    .args(["search", "--name", "Aoi"])
                                    .output()
                                    .ok()
                                    .and_then(|o| {
                                        let wid = String::from_utf8_lossy(&o.stdout).trim().to_string();
                                        if !wid.is_empty() {
                                            let _ = Command::new("xdotool")
                                                .args(["windowmove", &wid, &x.to_string(), &y.to_string()])
                                                .output();
                                        }
                                        Some(())
                                    });
                            }
                        }
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
