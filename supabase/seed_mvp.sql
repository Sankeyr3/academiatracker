-- Contenido del MVP de la academia QProject (ejecutar en Supabase > SQL Editor,
-- después de schema.sql). Cada fila es un bloque; `hours` = algoritmos / 21
-- (referencia: PLL de 21 algoritmos = 1 h). Se añade al final de la lista actual.

insert into public.videos (title, module, hours, notes, position)
select v.title, v.module, v.hours, v.notes,
       (select coalesce(max(position), 0) from public.videos) + v.n
from (values
  -- 3x3
  ( 1, 'Speed Starters (principiantes)',                   '3x3',               1.00, '21 algoritmos'),
  ( 2, 'Fridrich reducido (OLL 10 + PLL 6) + explicación', '3x3',               1.00, '21 algoritmos'),
  ( 3, 'F2L reducido',                                     '3x3',               1.00, '21 algoritmos'),
  ( 4, 'F2L, casos avanzados',                             '3x3',               0.00, 'Falta decidir cuántos casos'),
  ( 5, 'OLL completo',                                     '3x3',               2.71, '57 algoritmos'),
  ( 6, 'PLL completo',                                     '3x3',               1.00, '21 algoritmos · ¿entra en el MVP?'),
  ( 7, 'COLL sin Sune ni Antisune',                        '3x3',               1.43, '~30 algoritmos'),
  ( 8, 'VHLS',                                             '3x3',               1.52, '32 algoritmos'),
  ( 9, 'Forzar la cruz con el par',                        '3x3',               0.48, '10 unidades'),
  (10, 'Lubricar el cubo',                                 '3x3',               0.24, '5 unidades'),
  (11, 'Una mano (cómo cogerlo + adaptar los PLL)',        '3x3',               1.43, '~30 unidades'),
  -- 2x2
  (12, 'Ortega (7 OLL + 2 PLL + 4 PBL)',                   '2x2',               0.62, '13 algoritmos · ¿4 o 5 de PBL?'),
  (13, 'Primera capa para sub-10/8/6/5',                   '2x2',               1.00, '21 unidades'),
  (14, 'One-look para sub-3 → sub-2',                      '2x2',               1.00, '21 unidades'),
  -- Cubos grandes
  (15, '4x4 (reducción, paridades, Yau)',                  'Cubos grandes',     2.00, '42 unidades'),
  (16, '5x5 (reducción, Yau, paridades)',                  'Cubos grandes',     1.00, '21 unidades'),
  -- Otras modalidades
  (17, 'Blind',                                            'Otras modalidades', 1.00, '21 unidades'),
  (18, 'Megaminx principiantes',                           'Otras modalidades', 1.00, '21 unidades'),
  (19, 'Pyraminx LBL',                                     'Otras modalidades', 0.48, '10 unidades'),
  (20, 'Skewb principiantes',                              'Otras modalidades', 0.48, '10 unidades'),
  (21, 'Clock (flip + i10moves + 7-simul flip)',           'Otras modalidades', 0.95, '~20 unidades')
  -- En duda: quitar el "--" de delante si entran en el MVP
  -- ,(22, 'CLL',                 'En duda', 2.00, '42 algoritmos')
  -- ,(23, 'EG1',                 'En duda', 2.00, '42 algoritmos')
  -- ,(24, 'Square-1 reducido',   'En duda', 1.00, '21 unidades')
) as v(n, title, module, hours, notes);
