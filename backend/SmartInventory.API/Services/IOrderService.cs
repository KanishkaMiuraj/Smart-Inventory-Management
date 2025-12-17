using SmartInventory.API.DTOs;
using SmartInventory.API.Models;

namespace SmartInventory.API.Services
{
    public interface IOrderService
    {
        // We promise that this service can Place an Order and return the created Order
        Task<Order> PlaceOrderAsync(CreateOrderRequest request);
    }
}