using Microsoft.AspNetCore.Mvc;

namespace Sensor.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorsController : ControllerBase
    {
        // Định nghĩa khuôn mẫu DTO để hứng dữ liệu JSON từ ESP32
        public class MoistureDataDto
        {
            public string device_id { get; set; } = string.Empty;
            public int moisture_percent { get; set; }
            public bool pump_status { get; set; }
        }

        // API Endpoint: POST api/sensors
        [HttpPost]
        public IActionResult ReceiveMoistureData([FromBody] MoistureDataDto data)
        {
            if (data == null)
            {
                return BadRequest("Dữ liệu không hợp lệ");
            }

            // In dữ liệu nhận được ra cửa sổ Terminal Backend để kiểm tra
            Console.WriteLine($"[API TreeO] Nhận từ {data.device_id}: Độ ẩm = {data.moisture_percent}%, Máy bơm = {data.pump_status}");

            // Trả về HTTP Status 200 OK cho ESP32
            return Ok(new { status = "success", message = "Đã nhận dữ liệu thành công!" });
        }
    }
}