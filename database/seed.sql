-- Initial Data Seeding

USE hostel_management;

-- Insert an Admin (Password: 'admin123' hashed with bcrypt)
-- Note: Replace the hash with the actual bcrypt hash of your chosen password. 
-- For demo purposes, we will use a known hash for 'admin123': $2b$10$ZxPopSOtUd/vrkCC7W6oz.SB.5TMiuSvoJwSB8a9hQrtVtuhzyh9S
INSERT INTO Admins (Username, PasswordHash) VALUES 
('admin', '$2b$10$ZxPopSOtUd/vrkCC7W6oz.SB.5TMiuSvoJwSB8a9hQrtVtuhzyh9S');

-- Insert Rooms
INSERT INTO Rooms (RoomNumber, RoomType, Capacity, FloorNumber) VALUES 
('101', 'Single', 1, 1),
('102', 'Double', 2, 1),
('103', 'Triple', 3, 1),
('201', 'Single', 1, 2),
('202', 'Double', 2, 2),
('203', 'Dormitory', 4, 2);

-- Insert Students (Triggers will automatically update OccupiedCount)
INSERT INTO Students (FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID) VALUES 
('Alice Smith', 'Computer Science', 2, '555-0101', 'alice@example.com', '123 Elm St', '555-0201', 1),
('Bob Johnson', 'Mechanical', 3, '555-0102', 'bob@example.com', '456 Oak St', '555-0202', 2),
('Charlie Brown', 'Civil', 1, '555-0103', 'charlie@example.com', '789 Pine St', '555-0203', 2);

-- Insert Fees
INSERT INTO Fees (StudentID, Amount, DueDate, PaymentStatus) VALUES 
(1, 1500.00, '2023-12-01', 'Paid'),
(2, 1500.00, '2023-12-01', 'Pending'),
(3, 1500.00, '2023-12-01', 'Overdue');

-- Insert Complaints
INSERT INTO Complaints (StudentID, ComplaintText, Status) VALUES 
(1, 'Wi-Fi is not working in room 101', 'Pending'),
(2, 'Leaking tap in bathroom', 'Resolved'),
(3, 'Fan is making noise', 'In Progress');

-- Insert MessPlans
INSERT INTO MessPlans (StudentID, PlanType, Amount, StartDate, EndDate) VALUES 
(1, 'Veg', 3000.00, '2023-08-01', '2023-12-31'),
(2, 'Non-Veg', 4000.00, '2023-08-01', '2023-12-31'),
(3, 'Veg', 3000.00, '2023-08-01', '2023-12-31');
