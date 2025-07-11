-- db/seed.sql
-- Este script popula o banco de dados com dados de exemplo para teste.

SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- Limpar dados existentes para evitar duplicados
DELETE FROM pedido_itens;
DELETE FROM favoritos;
DELETE FROM pedidos;
DELETE FROM moradas;
DELETE FROM produtos;
DELETE FROM categorias;
DELETE FROM usuarios;

-- Resetar auto-incremento
ALTER TABLE pedido_itens AUTO_INCREMENT = 1;
ALTER TABLE pedidos AUTO_INCREMENT = 1;
ALTER TABLE produtos AUTO_INCREMENT = 1;
ALTER TABLE categorias AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
ALTER TABLE favoritos AUTO_INCREMENT = 1;
ALTER TABLE moradas AUTO_INCREMENT = 1;


-- 1. Inserir Categorias
INSERT IGNORE INTO `categorias` (`id`, `nome`)
VALUES
    (1, 'Futebol'),
    (2, 'Corrida'),
    (3, 'Basquete'),
    (4, 'Natação'),
    (5, 'Ginásio'),
    (6, 'Ciclismo'),
    (7, 'Sapatilha'),
    (8, 'Camping'),
    (9, 'Esportes Radicais');
-- 2. Inserir Usuários (incluindo um admin)
-- A senha para todos os usuários de teste é '1234'.
-- O valor abaixo é o hash bcrypt correspondente a '1234', simulando o armazenamento seguro.
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `nif`, `email_fatura`, `role`, `ativo`, `ultimo_login`) VALUES
(1, 'Admin User', 'admin@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', '500100200', NULL, 'admin', 1, NOW() - INTERVAL 1 DAY),
(2, 'Ana Silva', 'ana.silva@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', '250100201', NULL, 'user', 1, NOW() - INTERVAL 2 DAY),
(3, 'Bruno Costa', 'bruno.costa@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', '250100202', NULL, 'user', 1, NOW() - INTERVAL 5 HOUR),
(4, 'Carla Dias', 'carla.dias@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', '250100203', NULL, 'user', 0, NOW() - INTERVAL 30 DAY),
(5, 'David Martins', 'david.martins@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', '250100204', NULL, 'user', 1, NOW() - INTERVAL 10 MINUTE);

-- 3. Inserir Moradas
INSERT INTO `moradas` (`user_id`, `nome_morada`, `rua`, `numero`, `complemento`, `conselho`, `distrito`, `codigo_postal`) VALUES
(2, 'Casa', 'Rua das Flores', '123', 'Apto 4B', 'Lisboa', 'Lisboa', '1000-001'),
(3, 'Trabalho', 'Avenida da Liberdade', '456', 'Piso 2', 'Lisboa', 'Lisboa', '1250-142'),
(5, 'Casa de Praia', 'Rua da Praia', '789', NULL, 'Cascais', 'Lisboa', '2750-310'),
(4, 'Casa', 'Rua do Ouro', '150', 'Andar 3', 'Porto', 'Porto', '4050-422');

-- 4. Inserir Produtos
INSERT IGNORE INTO `produtos` (
    `nome`,
    `descricao`,
    `preco`,
    `imagem`,
    `categoria_id`
)
VALUES
    -- Futebol
    (
        'Bola de Futebol Nike Strike',
        'Bola de futebol oficial Nike Strike com tecnologia...',
        29.99,
        'https://www.futbolemotion.com/imagesarticulos/232417/grandes/balon-nike-flight-white-blackened-blue-hyper-crimson-0.webp',
        1
    ),
    (
        'Chuteira Adidas Predator',
        'Chuteira Adidas Predator para campos de grama natural...',
        85.99,
        'https://contents.mediadecathlon.com/p2859696/k$650f1f8b85a3b04e36a7384930ce1572/sq/chuteiras-de-futebol-crianca-adidas-predator-league-fgmg-vermelho.jpg?format=auto&f=2400x2400',
        1
    ),
    (
        'Camisa Oficial Seleção Brasileira',
        'Camisa oficial da Seleção Brasileira modelo 2024.',
        249.90,
        NULL,
        1
    ),
    (
        'Meião Nike Pro',
        'Meião de compressão ideal para treinos e jogos.',
        39.90,
        NULL,
        1
    ),
    (
        'Luvas de Goleiro Puma One',
        'Luvas com grip excelente e fecho em velcro.',
        129.90,
        NULL,
        1
    ),
    (
        'Cones para Treino',
        'Kit com 20 cones de agilidade para treino de futebol.',
        59.99,
        NULL,
        1
    ),
    (
        'Mini Gol Portátil',
        'Gol desmontável ideal para treinos em casa.',
        109.00,
        NULL,
        1
    ),
    -- Corrida
    (
        'Relógio GPS para Corrida Garmin',
        'Relógio Garmin com GPS integrado, monitor cardíaco...',
        349.99,
        'https://contents.mediadecathlon.com/p2313075/k$50947a49d9acacb0e55200466e434688/sq/smartwatch-gps-garmin-forerunner-255-cinzento-ardosia.jpg?format=auto&f=2400x2400',
        2
    ),
    (
        'Sapatilha Asics Gel Nimbus 25',
        'Sapatilha de corrida com alta absorção de impacto.',
        799.00,
        NULL,
        2
    ),
    (
        'Cinto de Hidratação',
        'Cinto com garrafas para hidratação durante corridas longas.',
        89.90,
        NULL,
        2
    ),
    (
        'Touca com Proteção UV',
        'Touca esportiva leve e respirável.',
        49.90,
        NULL,
        2
    ),
    (
        'Manguito Compressivo',
        'Par de manguitos com tecido tecnológico.',
        39.90,
        NULL,
        2
    ),
    (
        'Camiseta Dry-Fit',
        'Camiseta leve e ventilada para corrida.',
        69.90,
        NULL,
        2
    ),
    -- Basquete
    (
        'Bola de Basquete Spalding NBA',
        'Bola oficial com aderência premium.',
        199.99,
        NULL,
        3
    ),
    (
        'Camiseta Lakers LeBron James',
        'Camiseta oficial NBA LeBron James 23.',
        199.90,
        NULL,
        3
    ),
    (
        'Sapatilha Jordan Zion',
        'Sapatilha de basquete com sola aderente.',
        699.00,
        NULL,
        3
    ),
    (
        'Suporte de Aro Portátil',
        'Aro de basquete ajustável para quintal.',
        599.00,
        NULL,
        3
    ),
    (
        'Munhequeira Nike Elite',
        'Par de munhequeiras com absorção de suor.',
        34.90,
        NULL,
        3
    ),
    -- Natação
    (
        'Óculos de Natação Speedo',
        'Óculos com vedação perfeita e antiembaçante.',
        79.90,
        NULL,
        4
    ),
    (
        'Touca de Silicone',
        'Touca resistente para proteção dos cabelos.',
        29.90,
        NULL,
        4
    ),
    (
        'Maiô Arena Pro',
        'Maiô de performance para competições.',
        149.90,
        NULL,
        4
    ),
    (
        'Palmar de Natação',
        'Equipamento para fortalecimento dos braços.',
        49.90,
        NULL,
        4
    ),
    (
        'Nadadeira Curta',
        'Nadadeira ideal para treino técnico.',
        99.90,
        NULL,
        4
    ),
    -- Ginsio
    (
        'Kit Halteres 10kg',
        'Par de halteres com ajuste de peso.',
        229.00,
        NULL,
        5
    ),
    (
        'Tapete para Yoga/Alongamento',
        'Tapete antiderrapante e confortável.',
        89.90,
        NULL,
        5
    ),
    (
        'Caneleira com Peso',
        'Caneleira 2kg com velcro resistente.',
        69.90,
        NULL,
        5
    ),
    (
        'Corda de Pular Pro',
        'Corda com rolamento profissional.',
        49.90,
        NULL,
        5
    ),
    (
        'Faixa de Resistência',
        'Faixa elástica para treino funcional.',
        39.90,
        NULL,
        5
    ),
    -- Ciclismo
    (
        'Capacete MTB Absolute Nero',
        'Capacete leve com ventilação ideal.',
        199.90,
        NULL,
        6
    ),
    (
        'Óculos UV Ciclismo',
        'Óculos com lente espelhada e proteção solar.',
        79.90,
        NULL,
        6
    ),
    (
        'Bermuda com Forro',
        'Bermuda acolchoada para pedaladas longas.',
        119.90,
        NULL,
        6
    ),
    (
        'Cadeado com Chave',
        'Cadeado de segurança para bicicleta.',
        59.90,
        NULL,
        6
    ),
    (
        'Suporte de Caramanhola',
        'Suporte de garrafa leve e resistente.',
        29.90,
        NULL,
        6
    ),
    -- Sapatilha
    (
        'Raquete Wilson Pro Staff',
        'Raquete usada por Roger Federer.',
        1099.90,
        NULL,
        7
    ),
    (
        'Bolsa para Raqueteiros',
        'Bolsa térmica com capacidade para 6 raquetes.',
        349.90,
        NULL,
        7
    ),
    (
        'Kit Bolas de Sapatilha',
        'Kit com 3 bolas pressurizadas.',
        49.90,
        NULL,
        7
    ),
    (
        'Munhequeira Adidas Sapatilha',
        'Munhequeira de algodão absorvente.',
        29.90,
        NULL,
        7
    ),
    (
        'Camiseta Polo Esportiva',
        'Polo leve para partidas de tênis.',
        99.90,
        NULL,
        7
    ),
    -- Camping
    (
        'Barraca 2 Pessoas',
        'Barraca resistente à chuva e fácil de montar.',
        399.00,
        NULL,
        8
    ),
    (
        'Lanterna de Cabeça',
        'Lanterna LED com faixa ajustável.',
        69.90,
        NULL,
        8
    ),
    (
        'Saco de Dormir Térmico',
        'Ideal para noites frias ao ar livre.',
        189.90,
        NULL,
        8
    ),
    (
        'Kit Talheres Portátil',
        'Talheres dobráveis para camping.',
        49.90,
        NULL,
        8
    ),
    (
        'Cadeira Dobrável',
        'Cadeira leve e compacta para acampamentos.',
        129.90,
        NULL,
        8
    ),
    -- Esportes Radicais
    (
        'Skate Maple 7 Camadas',
        'Skate profissional com shape canadense.',
        349.00,
        NULL,
        9
    ),
    (
        'Capacete para Skate/BMX',
        'Capacete com certificado de segurança.',
        139.90,
        NULL,
        9
    ),
    (
        'Kneepad Pro',
        'Joelheira de alta resistência para manobras.',
        89.90,
        NULL,
        9
    ),
    (
        'Óculos para Snowboard',
        'Lentes espelhadas e proteção UV total.',
        199.90,
        NULL,
        9
    ),
    (
        'Luvas para Escalada',
        'Luvas com grip e proteção reforçada.',
        59.90,
        NULL,
        9
    );


-- 4. Inserir Pedidos
-- Simulando pedidos em diferentes datas e com status variados
INSERT INTO `pedidos` (`id`, `user_id`, `morada_id`, `subtotal`, `valor_entrega`, `total`, `metodo_pagamento`, `status`, `data_criacao`) VALUES
(1, 2, 1, 200.50, 5.00, 205.50, 'Cartão de Crédito', 'Enviado', NOW() - INTERVAL 15 DAY),
(2, 3, 2, 90.00, 5.00, 95.00, 'Cartão de Crédito', 'Pago', NOW() - INTERVAL 10 DAY),
(3, 5, 3, 285.00, 5.00, 290.00, 'Cartão de Crédito', 'Enviado', NOW() - INTERVAL 8 DAY),
(4, 2, 1, 65.00, 5.00, 70.00, 'MB Way', 'Cancelado', NOW() - INTERVAL 5 DAY),
(5, 4, 4, 75.00, 5.00, 80.00, 'Cartão de Crédito', 'Pago', NOW() - INTERVAL 3 DAY),
(6, 5, 3, 10.00, 5.00, 15.00, 'PayPal', 'Pendente', NOW() - INTERVAL 1 DAY),
(7, 3, 2, 115.00, 5.00, 120.00, 'Cartão de Crédito', 'Pago', NOW() - INTERVAL 22 HOUR),
(8, 2, 1, 245.00, 5.00, 250.00, 'Cartão de Crédito', 'Pendente', NOW() - INTERVAL 5 HOUR);

-- 5. Inserir Itens do Pedido
INSERT INTO `pedido_itens` (`pedido_id`, `produto_id`, `quantidade`, `preco_unitario`) VALUES
-- Pedido 1
(1, 1, 1, 120.00),
(1, 2, 1, 85.50),
-- Pedido 2
(2, 3, 1, 95.00),
-- Pedido 3
(3, 4, 1, 250.00),
(3, 5, 1, 40.00),
-- Pedido 4
(4, 7, 1, 70.00),
-- Pedido 5
(5, 8, 1, 55.00),
(5, 9, 1, 25.00),
-- Pedido 6
(6, 10, 1, 15.00),
-- Pedido 7
(7, 1, 1, 120.00),
-- Pedido 8
(8, 4, 1, 250.00);

-- 6. Inserir Favoritos
INSERT INTO `favoritos` (`user_id`, `produto_id`) VALUES
(2, 1),
(2, 3),
(3, 5),
(5, 2),
(5, 8);

-- 7. Inserir Favoritos
INSERT IGNORE INTO `favoritos` (`user_id`, `produto_id`) VALUES
(2, 1),
(2, 3),
(3, 5),
(5, 2),
(5, 8);

COMMIT;

SELECT 'Banco de dados populado com sucesso!' as status;