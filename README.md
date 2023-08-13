## PLANNING


model Habit
    - Type

Tables:
- Habit
- User
(maybe oauth stuff for google login)

Table Habit:
    - Habit


Habit table indexes
    - week_no
    - user

    Habit;
        - id
        - user_id
        - habit_d

        - HabitState (FK)

    HabitState<boolean>: 
        - id (PK)
        - week_no
        - year
        - day
        - data: {
            "active" : False    
        }
    
    HabitState<quantitative>:
        - id (PK)
        - week_no
        - year
        - day
        - data: {
            ""
        }


