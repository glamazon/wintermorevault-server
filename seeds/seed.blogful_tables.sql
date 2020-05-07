BEGIN;

TRUNCATE
  users,
  wintermorevault_events,
  RESTART IDENTITY CASCADE;

INSERT INTO users (id, user_name, full_name, password, date created)
VALUES
  
  ('1','happyuser', 'Happy User', '$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUu', '05/05/2020');

  ('2', 'happyuser1', 'Happy1 User1', '$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUv', '05/05/2020'
);

INSERT INTO wintermorevault_events (artist, notes, user_id, date)
VALUES
  ('The Black Crowes', 'My Favorite Concert', 1,
    '05/05/1999'),
    ('Whiskey Myers', 'My Favorite Concert last year', 2,
    '05/05/2019'
),
  
COMMIT;
