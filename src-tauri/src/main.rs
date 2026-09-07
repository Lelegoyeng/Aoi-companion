use std::process::Command;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Halo, {}! Aoi di sini~", name)
}

// Ukuran window (harus sama dengan "width"/"height" di tauri.conf.json).
const WIN_W: f64 = 300.0;
const WIN_H: f64 = 600.0;

/// Posisi pojok kanan-bawah layar (logical pixel).
/// x menyesuaikan lebar layar, y menyesuaikan tinggi layar.
fn bottom_right_position(screen_w: f64, screen_h: f64) -> tauri::Position {
    tauri::Position::Logical(tauri::LogicalPosition::new(screen_w - WIN_W, screen_h - WIN_H))
}

/// Tempel window di pojok kanan-bawah monitor utama (atau monitor pertama).
/// Mengembalikan `true` bila berhasil.
fn anchor_bottom_right(window: &tauri::WebviewWindow) -> bool {
    if let Ok(Some(monitor)) = window.primary_monitor() {
        let size = monitor.size();
        let scale = monitor.scale_factor();
        let _ = window.set_position(bottom_right_position(size.width as f64 / scale, size.height as f64 / scale));
        return true;
    }

    if let Ok(monitors) = window.available_monitors() {
        if let Some(monitor) = monitors.first() {
            let size = monitor.size();
            let scale = monitor.scale_factor();
            let _ = window.set_position(bottom_right_position(size.width as f64 / scale, size.height as f64 / scale));
            return true;
        }
    }

    false
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_always_on_top(true)?;

            // Posisikan window di pojok kanan-bawah layar.
            if !anchor_bottom_right(&window) {
                // Fallback bila API monitor tidak tersedia: pakai xdotool.
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(500));
                    if let Ok(out) = Command::new("xdotool").args(["getdisplaygeometry"]).output() {
                        let geo = String::from_utf8_lossy(&out.stdout);
                        let parts: Vec<&str> = geo.trim().split_whitespace().collect();
                        if parts.len() >= 2 {
                            if let (Ok(sw), Ok(sh)) = (parts[0].parse::<i32>(), parts[1].parse::<i32>()) {
                                let _ = Command::new("xdotool")
                                    .args(["search", "--name", "Aoi"])
                                    .output()
                                    .ok()
                                    .and_then(|o| {
                                        let wid = String::from_utf8_lossy(&o.stdout).trim().to_string();
                                        if !wid.is_empty() {
                                            // kanan-bawah: x = lebar layar - lebar window, y = tinggi layar - tinggi window
                                            let _ = Command::new("xdotool")
                                                .args(["windowmove", &wid, &(sw - WIN_W as i32).to_string(), &(sh - WIN_H as i32).to_string()])
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
