using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartInventory.API.Data;
using SmartInventory.API.DTOs;
using SmartInventory.API.Models;
using SmartInventory.API.Services;

namespace SmartInventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService; // The Logic
        private readonly AppDbContext _context;       // The Database Access (for Reports)

        // Dependency Injection: We request both the Service and the Database Context
        public OrdersController(IOrderService orderService, AppDbContext context)
        {
            _orderService = orderService;
            _context = context;
        }

  
        // 1. CUSTOMER FEATURE: Place Order (US-005 & US-006)
        // =========================================================================
        [HttpPost]
        public async Task<IActionResult> PlaceOrder(CreateOrderRequest request)
        {
            try
            {
                // We delegate the complex logic (Stock checks, Calculations) to the Service Layer
                var createdOrder = await _orderService.PlaceOrderAsync(request);

                // Return 201 Created with the location of the new resource
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                // If the Service throws "Insufficient Stock", we return 400 Bad Request
                return BadRequest(new { message = ex.Message });
            }
        }

        
        // 2. ADMIN FEATURE: View All Orders (US-007)
        // =========================================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders(
            [FromQuery] string? status,
            [FromQuery] DateTime? date)
        {
            // Start with a query that includes the OrderItems (Eager Loading)
            var query = _context.Orders
                                .Include(o => o.OrderItems)
                                .ThenInclude(oi => oi.Product) // Optional: Include Product details inside items
                                .AsQueryable();

            // LINQ Filter 1: Filter by Status (e.g., ?status=Pending)
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.Status == status);
            }

            // LINQ Filter 2: Filter by Date (e.g., ?date=2025-12-12)
            if (date.HasValue)
            {
                query = query.Where(o => o.OrderDate.Date == date.Value.Date);
            }

            // Return sorted by newest first
            return await query.OrderByDescending(o => o.OrderDate).ToListAsync();
        }

       
        // 3. ADMIN FEATURE: Update Order Status (US-008)
        // =========================================================================
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string newStatus)
        {
            // Validation: Ensure the status is one of the allowed values
            var validStatuses = new[] { "Pending", "Approved", "Shipped", "Cancelled" };

            // Check if the sent status is in our valid list
            if (!validStatuses.Contains(newStatus))
            {
                return BadRequest(new { message = "Invalid Status. Allowed values: Pending, Approved, Shipped, Cancelled." });
            }

            // Find the Order
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            // Update and Save
            order.Status = newStatus;
            await _context.SaveChangesAsync();

            return NoContent(); // 204 Success
        }

        
        // Helper Endpoint (Used by CreatedAtAction)
        // =========================================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(int id)
        {
            var order = await _context.Orders
                                      .Include(o => o.OrderItems)
                                      .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return order;
        }
    }
}