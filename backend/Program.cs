using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GymDbContext>(options =>
    options.UseSqlServer("Server=ABDULLAHMANANPC;Database=GymDb;User Id=sa;Password=123;TrustServerCertificate=True;"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = 
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});


var app = builder.Build();


app.UseCors("AllowFrontend");


// Defined endpoints for CRUD operations, specifically for the Member entity

app.MapGet("/members", (GymDbContext db) => db.Members.ToList());

app.MapGet("/members/{Id}", (GymDbContext db, int Id) => db.Members.FirstOrDefault(m => m.Id == Id));

app.MapPost("/members" , (GymDbContext db, Member newMember) => 
{
    db.Members.Add(newMember); 
    db.SaveChanges();
    return newMember;});

app.MapPut("/members/{Id}", (GymDbContext db, int Id, Member updatedMember) =>  
{
    
    var existing = db.Members.FirstOrDefault(m=>m.Id == Id); 
    existing.Name = updatedMember.Name; 
    existing.Email = updatedMember.Email; 
    db.SaveChanges();
    return existing;
});

app.MapDelete("/members/{Id}", (GymDbContext db, int Id) =>
{
    var existing = db.Members.FirstOrDefault(m=>m.Id == Id);
    db.Members.Remove(existing);
    db.SaveChanges();
    return "Deleting Done";

});

//Defined endpoints for CRUD operations, specifically for the Membership entity
app.MapPost("/memberships", (GymDbContext db, Membership newMembership) =>
{
    db.Memberships.Add(newMembership);
    db.SaveChanges();
    return db.Memberships
    .Include(m => m.Member)
    .FirstOrDefault(m => m.Id == newMembership.Id);
});

app.MapGet("/memberships", (GymDbContext db ) => db.Memberships.Include(m => m.Member).ToList());


app.MapGet("/members/{Id}/membership", (GymDbContext db, int Id) =>
{
    var member = db.Members
    .Include(m=>m.Membership)
    .FirstOrDefault(m=>m.Id == Id);
    return member?.Membership;
});

app.MapPut("/memberships/{Id}", (GymDbContext db, int Id, Membership updatedMembership) =>
{
    var existing = db.Memberships.Include(m => m.Member)
    .FirstOrDefault(m => m.Id == Id);
    existing.Type = updatedMembership.Type;
    existing.Price = updatedMembership.Price;
    existing.StartDate = updatedMembership.StartDate;
    existing.EndDate = updatedMembership.EndDate;
    db.SaveChanges();
    return existing;
});

app.MapDelete("/memberships/{Id}", (GymDbContext db, int Id) =>
{
    var existing = db.Memberships.Include(m => m.Member)
    .FirstOrDefault(m => m.Id == Id);
    db.Memberships.Remove(existing);
    db.SaveChanges();
    return "Deleting Done";

});

// Defined Get endpoint to check membership status for a member

app.MapGet("/members/{Id}/membership/isactive", (GymDbContext db, int Id) =>
{
    var membership = db.Memberships.FirstOrDefault(m => m.MemberId == Id);
    if (membership == null) return "No membership found";
    
    bool isActive = DateOnly.FromDateTime(DateTime.Now) >= membership.StartDate && DateOnly.FromDateTime(DateTime.Now) <= membership.EndDate;
    return isActive ? "Membership is active" : "Membership is not active";
});

// Defined endpoints for CRUD operations, specifically for the CheckIn entity
app.MapPost("/members/{Id}/checkin", (GymDbContext db, int Id) =>
{
    var membership = db.Memberships.FirstOrDefault(m => m.MemberId == Id);
    if (membership == null) return "Membership not found, cannot check in.";
    bool isActive = DateOnly.FromDateTime(DateTime.Now) >= membership.StartDate && DateOnly.FromDateTime(DateTime.Now) <= membership.EndDate;
    if (!isActive) return "Membership is not active, cannot check in.";
    else
    {
        var CheckIn = new CheckIn
        {
            CheckInDay = DateOnly.FromDateTime(DateTime.Now),
            MemberId = Id,
            
        };
        db.CheckIns.Add(CheckIn);
        db.SaveChanges();
        return "CheckIn recorded successfully.";
    }

});

app.MapGet("/members/{Id}/checkins", (GymDbContext db, int Id) =>
{
    var checkinList = db.CheckIns
    .Where(m => m.MemberId == Id)
    .ToList();
    return checkinList;
});


app.UseDefaultFiles();
app.UseStaticFiles();
app.Run();


public class Member
{
    public int Id {get; set;}
    public string? Name {get; set;}
    public string? Email {get; set;}
    public Membership? Membership {get; set;}
    public List<CheckIn> CheckIns {get; set;} = new();
}

public class Membership
{
    public int Id {get; set;}
    public string? Type {get; set;}

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    public DateOnly StartDate {get; set;}
    public DateOnly EndDate {get; set;}
    public int MemberId {get; set;}
    public Member? Member {get; set;}
}

public class CheckIn
{
    public int Id {get; set;}
    public DateOnly CheckInDay {get; set;}
    public int MemberId {get; set;}
    [JsonIgnore]
    public Member? Member {get; set;}
}

public class GymDbContext : DbContext
{
    public GymDbContext(DbContextOptions<GymDbContext> options) : base(options)
    {
    }

    public DbSet<Member> Members { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<CheckIn> CheckIns { get; set; }
}