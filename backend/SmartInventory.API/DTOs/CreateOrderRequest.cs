using System.ComponentModel.DataAnnotations;

namespace SmartInventory.API.DTOs
{
    // Customer sends this list of items they want to buy
    public class CreateOrderRequest
    {
        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}