namespace SmartInventory.DTOs
{
    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Sku { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

      
        // Stcok threshold level check.
        public bool IsLowStock { get; set; }
    }
}