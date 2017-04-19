/*
 * When Postgresql server is installed and a database uno is created,
 * to create the following tables and insert some data, in a terminal
 * run the command: 
 *   psql uno < uno.sql
 */

CREATE TABLE IF NOT EXISTS Avatars (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS Cards (
  id INTEGER PRIMARY KEY,
  image_url VARCHAR(128),
  point INTEGER NOT NULL,
  color VARCHAR(1),
  number_symbol SMALLINT
);

CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  avatar_id SMALLINT REFERENCES Avatars(id),
  encrypted_password VARCHAR(256) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  nick_name VARCHAR(32),
  user_score INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Games (
  id SERIAL PRIMARY KEY,
  seat_count SMALLINT DEFAULT 0,
  seat_turn SMALLINT,
  direction SMALLINT,
  next_order SMALLINT,
  top_discard INTEGER REFERENCES Cards(id),
  joinable BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS Messages (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES Games(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES Users(id),
  post_time TIME WITH TIME ZONE,
  message VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Game_Cards (
  game_id INTEGER REFERENCES Games(id),
  card_id INTEGER REFERENCES Cards(id),
  player_id INTEGER,
  pile_order INTEGER,
  PRIMARY KEY (game_id, card_id)
);

CREATE TABLE IF NOT EXISTS Players (
  game_id INTEGER REFERENCES Games(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES Users(id),
  ready_play BOOLEAN DEFAULT FALSE,
  seat_number SMALLINT NOT NULL,
  say_uno BOOLEAN DEFAULT FALSE,
  announce_suit VARCHAR(1) DEFAULT NULL,
  score INTEGER DEFAULT 0,
  PRIMARY KEY (game_id, user_id)
);

INSERT INTO Cards (id, image_url, point, color, number_symbol) VALUES
  (0, 'r0.png', 0, 'r', 0),
  (1, 'r1.png', 1, 'r', 1),
  (2, 'r1.png', 1, 'r', 1),
  (3, 'r2.png', 2, 'r', 2),
  (4, 'r2.png', 2, 'r', 2),
  (5, 'r3.png', 3, 'r', 3),
  (6, 'r3.png', 3, 'r', 3),
  (7, 'r4.png', 4, 'r', 4),
  (8, 'r4.png', 4, 'r', 4),
  (9, 'r5.png', 5, 'r', 5),
  (10, 'r5.png', 5, 'r', 5),
  (11, 'r6.png', 6, 'r', 6),
  (12, 'r6.png', 6, 'r', 6),
  (13, 'r7.png', 7, 'r', 7),
  (14, 'r7.png', 7, 'r', 7),
  (15, 'r8.png', 8, 'r', 8),
  (16, 'r8.png', 8, 'r', 8),
  (17, 'r9.png', 9, 'r', 9),
  (18, 'r9.png', 9, 'r', 9),
  (19, 'r_skip.png', 20, 'r', 10),
  (20, 'r_skip.png', 20, 'r', 10),
  (21, 'r_reverse.png', 20, 'r', 11),
  (22, 'r_reverse.png', 20, 'r', 11),
  (23, 'r_draw2.png', 20, 'r', 12),
  (24, 'r_draw2.png', 20, 'r', 12),
  (25, 'y0.png', 0, 'y', 0),
  (26, 'y1.png', 1, 'y', 1),
  (27, 'y1.png', 1, 'y', 1),
  (28, 'y2.png', 2, 'y', 2),
  (29, 'y2.png', 2, 'y', 2),
  (30, 'y3.png', 3, 'y', 3),
  (31, 'y3.png', 3, 'y', 3),
  (32, 'y4.png', 4, 'y', 4),
  (33, 'y4.png', 4, 'y', 4),
  (34, 'y5.png', 5, 'y', 5),
  (35, 'y5.png', 5, 'y', 5),
  (36, 'y6.png', 6, 'y', 6),
  (37, 'y6.png', 6, 'y', 6),
  (38, 'y7.png', 7, 'y', 7),
  (39, 'y7.png', 7, 'y', 7),
  (40, 'y8.png', 8, 'y', 8),
  (41, 'y8.png', 8, 'y', 8),
  (42, 'y9.png', 9, 'y', 9),
  (43, 'y9.png', 9, 'y', 9),
  (44, 'y_skip.png', 20, 'y', 10),
  (45, 'y_skip.png', 20, 'y', 10),
  (46, 'y_reverse.png', 20, 'y', 11),
  (47, 'y_reverse.png', 20, 'y', 11),
  (48, 'y_draw2.png', 20, 'y', 12),
  (49, 'y_draw2.png', 20, 'y', 12),
  (50, 'g0.png', 0, 'g', 0),
  (51, 'g1.png', 1, 'g', 1),
  (52, 'g1.png', 1, 'g', 1),
  (53, 'g2.png', 2, 'g', 2),
  (54, 'g2.png', 2, 'g', 2),
  (55, 'g3.png', 3, 'g', 3),
  (56, 'g3.png', 3, 'g', 3),
  (57, 'g4.png', 4, 'g', 4),
  (58, 'g4.png', 4, 'g', 4),
  (59, 'g5.png', 5, 'g', 5),
  (60, 'g5.png', 5, 'g', 5),
  (61, 'g6.png', 6, 'g', 6),
  (62, 'g6.png', 6, 'g', 6),
  (63, 'g7.png', 7, 'g', 7),
  (64, 'g7.png', 7, 'g', 7),
  (65, 'g8.png', 8, 'g', 8),
  (66, 'g8.png', 8, 'g', 8),
  (67, 'g9.png', 9, 'g', 9),
  (68, 'g9.png', 9, 'g', 9),
  (69, 'g_skip.png', 20, 'g', 10),
  (70, 'g_skip.png', 20, 'g', 10),
  (71, 'g_reverse.png', 20, 'g', 11),
  (72, 'g_reverse.png', 20, 'g', 11),
  (73, 'g_draw2.png', 20, 'g', 12),
  (74, 'g_draw2.png', 20, 'g', 12),
  (75, 'b0.png', 0, 'b', 0),
  (76, 'b1.png', 1, 'b', 1),
  (77, 'b1.png', 1, 'b', 1),
  (78, 'b2.png', 2, 'b', 2),
  (79, 'b2.png', 2, 'b', 2),
  (80, 'b3.png', 3, 'b', 3),
  (81, 'b3.png', 3, 'b', 3),
  (82, 'b4.png', 4, 'b', 4),
  (83, 'b4.png', 4, 'b', 4),
  (84, 'b5.png', 5, 'b', 5),
  (85, 'b5.png', 5, 'b', 5),
  (86, 'b6.png', 6, 'b', 6),
  (87, 'b6.png', 6, 'b', 6),
  (88, 'b7.png', 7, 'b', 7),
  (89, 'b7.png', 7, 'b', 7),
  (90, 'b8.png', 8, 'b', 8),
  (91, 'b8.png', 8, 'b', 8),
  (92, 'b9.png', 9, 'b', 9),
  (93, 'b9.png', 9, 'b', 9),
  (94, 'b_skip.png', 20, 'b', 10),
  (95, 'b_skip.png', 20, 'b', 10),
  (96, 'b_reverse.png', 20, 'b', 11),
  (97, 'b_reverse.png', 20, 'b', 11),
  (98, 'b_draw2.png', 20, 'b', 12),
  (99, 'b_draw2.png', 20, 'b', 12),
  (100, 'wild.png', 50, 'n', 13),
  (101, 'wild.png', 50, 'n', 13),
  (102, 'wild.png', 50, 'n', 13),
  (103, 'wild.png', 50, 'n', 13),
  (104, 'wild4.png', 50, 'n', 14),
  (105, 'wild4.png', 50, 'n', 14),
  (106, 'wild4.png', 50, 'n', 14),
  (107, 'wild4.png', 50, 'n', 14);

