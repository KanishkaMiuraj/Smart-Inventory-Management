using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartInventory.API.Data;
using SmartInventory.API.Models;
using SmartInventory.DTOs;

namespace SmartInventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        // ==================================================================
        // CONSTRUCTOR
        // Injects Database Context and Configuration (appsettings.json)
        // ==================================================================
        public ProductsController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

       
        // POST: api/Products
        // Satisfies US-002: Add New Product
        // ==================================================================
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            // 1. Business Logic: Check if SKU already exists
            if (await _context.Products.AnyAsync(p => p.Sku == product.Sku))
            {
                return BadRequest(new { message = "A product with this SKU already exists." });
            }

            // 2. Save to Database
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // 3. Return success (201 Created)
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        
        // GET: api/Products/5
        // Standard Get by ID
        // ==================================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        
        // GET: api/Products
        // US-001 (Sorting) AND Fixes the Low Stock
        // ==================================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts()
        {
            // 1. READ CONFIGURATION: Get the threshold from appsettings.json
            // If missing, default to 10
            int threshold = _configuration.GetValue<int>("InventorySettings:LowStockThreshold", 10);

            // 2. FETCH DATA: Get products sorted alphabetically (US-001)
            var products = await _context.Products
                                 .OrderBy(p => p.Name)
                                 .ToListAsync();

            // 3. MAP TO DTO: Calculate 'IsLowStock' here (The Logic Layer)
            var productDtos = products.Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Sku = p.Sku,
                Price = p.Price,
                StockQuantity = p.StockQuantity,

                // LOGIC: True if stock is less than or equal to Config Threshold
                IsLowStock = p.StockQuantity <= threshold
            });

            return Ok(productDtos);
        }

       
        // PUT: api/Products/5/stock
        // US-003: Update Stock Quantity
        // ==================================================================
        [HttpPut("{id}/stock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] int newStock)
        {
            // 1. Validate Input
            if (newStock < 0)
            {
                return BadRequest(new { message = "Stock cannot be negative." });
            }

            // 2. Find the Product
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            // 3. Update the Stock
            product.StockQuantity = newStock;

            // 4. Save Changes with Exception Handling
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "Concurrency conflict occurred." });
            }

            return NoContent();
        }

        
        // GET: api/Products/low-stock
        // US-004: Low Stock Warning (Specific List)
        // ==================================================================
        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<Product>>> GetLowStockProducts()
        {
            // 1. Read from appsettings.json
            int threshold = _configuration.GetValue<int>("InventorySettings:LowStockThreshold");

            // 2. LINQ Query to filter items
            var lowStockProducts = await _context.Products
                                        .Where(p => p.StockQuantity <= threshold)
                                        .ToListAsync();

            return lowStockProducts;
        }
    }
}