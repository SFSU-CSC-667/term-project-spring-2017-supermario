INSERT INTO Users
  (avatar_id, encrypted_password, email, nick_name, user_score)
  VALUES 
  (1, null, abc, noname, 200),
  (8, null, abc1, second, 0),
  (3, null, abc2, third, 0),
  (5, null, abc3, four, 100);

INSERT INTO Games
  (seat_count, seat_turn, direction, next_order, top_discard, joinable, game_state)
  VALUES
  (4, 0, 1, 1, 1, false, 0),
  (1, 0, 1, 1, 1, false, 0);

INSERT INTO Players
  (game_id, user_id, ready_play, seat_number, say_uno, announce_suit, score)
  VALUES
  (1, 1, false, 0, false, null, 0),
  (2, 3, false, 0, false, null, 0),
  (1, 4, false, 0, false, null, 0);