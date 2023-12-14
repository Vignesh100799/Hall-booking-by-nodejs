const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = 4001;
const rooms = [
      {
        "roomId": 1,
        "roomName": "Conference Room A",
        "seats": 50,
        "amenities": ["projector", "whiteboard"],
        "pricePerHour": 100
      },
      {
        "roomId": 2,
        "roomName": "Boardroom B",
        "seats": 20,
        "amenities": ["teleconferencing", "coffee machine"],
        "pricePerHour": 75
      },
      {
        "roomId": 3,
        "roomName": "Training Room 1",
        "seats": 30,
        "amenities": ["flipchart", "computers"],
        "pricePerHour": 120
      },
      {
        "roomId": 4,
        "roomName": "Meeting Room X",
        "seats": 15,
        "amenities": ["TV", "conference phone"],
        "pricePerHour": 80
      },
      {
        "roomId": 5,
        "roomName": "Executive Suite",
        "seats": 10,
        "amenities": ["private restroom", "catering service"],
        "pricePerHour": 150
      }
]
const bookings = [
    {
        "bookingId":1,
        "customerName": "John Doe",
        "roomName": "Conference Room A",
        "roomId": 1,
        "date": "2023-01-01",
        "startTime": "10:00",
        "endTime": "12:00"
      },
      {
        "bookingId": 2,
        "customerName": "Alice Smith",
        "roomId": 3,
        "roomName": "Training Room 1",
        "date": "2023-01-02",
        "startTime": "14:00",
        "endTime": "16:00"
      },
      {
        "bookingId": 3,
        "customerName": "Bob Johnson",
        "roomId": 2,
        "roomName": "Boardroom B",
        "date": "2023-01-03",
        "startTime": "09:30",
        "endTime": "11:30"
      },
      {
        "bookingId": 4,
        "customerName": "John Doe",
        "roomId": 4,
        "roomName": "Meeting Room X",
        "date": "2023-01-04",
        "startTime": "13:00",
        "endTime": "15:00"
      },
      {
        "bookingId": 5,
        "customerName": "Eva Gonzalez",
        "roomId": 5,
        "roomName": "Executive Suite",
        "date": "2023-01-05",
        "startTime": "11:00",
        "endTime": "13:00"
      }
]

app.use(bodyParser.json())

// ................Home page
app.get("/",(req,res)=>{
  res.send( `
  <div style="text-align: center ; padding: 50px; background-color: blueviolet;">
  <h1 style="text-align: center;">
      Hello Welcome to Taj Hotel Bookings
  </h1>
 <div style="padding: 10px;">
  <a href="/rooms/booked" style="text-decoration: none; border: 1px solid white; color: black; padding: 10px;" >
      Click here to get Rooms with Booked
      </a>
 </div>
 <br>
 <div style="padding: 10px;">
  <a href="/customers/booked" style="text-decoration: none; border: 1px solid white; color: black; padding: 10px;">
      Click here to get Customers with Booked Rooms
      </a>
 </div>
 <br>
 <div style="padding: 10px;">
  <a href="/customers/John%20Doe/booking-history" style="text-decoration: none; border: 1px solid white; color: black; padding: 10px;">
      Click here to get Customers booking history with Booked Rooms
      </a>
 </div>
</div>

    `)
})

// Api to create Rooms

app.post('/rooms', (req, res) => {
    const newRoom = {
        roomId: rooms.length + 1,
        roomName: req.body.roomName,
        bookedStatus:false,
        seats: req.body.seats,
        amenities: req.body.amenities,
        pricePerHour: req.body.pricePerHour,
    };
    rooms.push(newRoom);
    res.send({message: 'Room created successfully',newRoom })
})
// API to Book a room

app.post("/booking", (req, res) => {
    const newBooking =
    {
        bookingId: bookings.length + 1,
        customerName: req.body.customerName,
        bookedStatus:true,
        roomName: req.body.roomName,
        roomId: req.body.roomId,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    };
    bookings.push(newBooking);
    res.send({message: 'Room booked successfully',newBooking })
   
})

// To get a rooms with booked data

app.get("/rooms/booked", (req, res) => {
    const bookedRooms = bookings.map((booking) => {
        const room = rooms.find((r) => r.roomId === booking.roomId);
        return {
            "roomName": booking.roomName,
            "bookedStatus": "confirmed",
            "customerName": booking.customerName,
            "date": booking.date,
            "startTime": booking.startTime,
            "endTime": booking.endTime,
        }
    });
    res.send(bookedRooms);
    
    
})

// To get a customers details with booked data

app.get("/customers/booked", (req, res) => {
    const bookedCustomer = bookings.map((booking) => {
        const room = rooms.find((r) => r.roomId === booking.roomId)

        return {
            customerName: booking.customerName,
            roomName: booking.roomName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        }
    })
    res.json(bookedCustomer)
})

// To get a customer Booking History by rooms booking

app.get('/customers/:customerName/booking-history', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookingHistory = bookings
      .filter((booking) => booking.customerName === customerName)
      .map((booking) => {
        const room = rooms.find((r) => r.roomId === booking.roomId);
        return {
     
          roomName: room.roomName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          bookingId: booking.bookingId,
          bookingDate: new Date().toISOString(),
          bookingStatus: 'Confirmed',
        };
      });
    res.json({customerName,Booking_History : customerBookingHistory});
  });
  
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})