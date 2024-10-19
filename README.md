# Online Student Management System

This project is an Online Student Management System designed to help educational institutions manage student information, courses, and related data efficiently.

## Features

- User Authentication (Login system)
- Dashboard for overview
- Student Information Management
- Course Management
- Attendance Tracking
- Grade Management
- Responsive design for various devices

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap (for responsive design)

## System Architecture

The system is designed with the following entity relationships:

![System Architecture](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(598)-CUY468PEP1rDxnMzas0CYB1ENtVC5a.png)

This diagram illustrates the database schema and relationships between different entities in the system:

- Student: Stores student information
- Teacher: Contains teacher details
- Feedback: Manages feedback given by students to teachers
- Course_selection: Handles course selections by students
- Course: Stores course information
- Session: Manages user sessions for authentication

## Project Structure


online-student-management/
│
├── css/
│   ├── style.css
│   └── ...
│
├── js/
│   ├── script.js
│   └── ...
│
├── index.html
├── dashboard.html
├── students.html
├── courses.html
├── attendance.html
├── grades.html
└── README.md


## About Project in short

* The project was made within the span on 24hrs and it lacks in some of the features provided by the problem statement like hiding the unwanted links but it has provided with the authentication and session management to restrict the user to specific pages.

* The project was created in such a way that anyone from university can register with their details and can select atmost 4 courses from the list.


## Setup and Installation

1. Clone the repository:
   
   git clone https://github.com/gummireddysandeepreddy/online-student-management.git
   

2. Navigate to the project directory:
   
   cd online-student-management
   

3. Install the dependencies:
   pnpm i


4. Build the Project:
   pnpm build


5. Run the Project:
   pnpm dev

## Usage

1. Log in using your credentials on the login page.
2. Navigate through different sections using the sidebar menu.
3. Manage student information, courses, attendance, and grades as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For any queries or suggestions, please contact:
Gummireddy Sandeep Reddy - [GitHub Profile](https://github.com/gummireddysandeepreddy)