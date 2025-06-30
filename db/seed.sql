-- db/seed.sql
-- Este script popula o banco de dados com dados de exemplo para teste.

SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- Limpar dados existentes para evitar duplicados
DELETE FROM pedido_itens;
DELETE FROM pedidos;
DELETE FROM produtos;
DELETE FROM categorias;
DELETE FROM usuarios;

-- Resetar auto-incremento
ALTER TABLE pedido_itens AUTO_INCREMENT = 1;
ALTER TABLE pedidos AUTO_INCREMENT = 1;
ALTER TABLE produtos AUTO_INCREMENT = 1;
ALTER TABLE categorias AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;


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
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `role`, `ativo`, `ultimo_login`) VALUES
(1, 'Admin User', 'admin@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', 'admin', 1, NOW() - INTERVAL 1 DAY),
(2, 'Ana Silva', 'ana.silva@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', 'user', 1, NOW() - INTERVAL 2 DAY),
(3, 'Bruno Costa', 'bruno.costa@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', 'user', 1, NOW() - INTERVAL 5 HOUR),
(4, 'Carla Dias', 'carla.dias@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', 'user', 0, NOW() - INTERVAL 30 DAY),
(5, 'David Martins', 'david.martins@example.com', '$2b$10$6jMr2cm53qMQZ/tp9zFM7.DBoOlH6qXkR0HOqtQ2WZTYEhfmBpFKq', 'user', 1, NOW() - INTERVAL 10 MINUTE);

-- Inserir Produtos
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
INSERT INTO `pedidos` (`id`, `user_id`, `total`, `status`, `data_criacao`) VALUES
(1, 2, 205.50, 'enviado', NOW() - INTERVAL 15 DAY),
(2, 3, 95.00, 'pago', NOW() - INTERVAL 10 DAY),
(3, 5, 290.00, 'enviado', NOW() - INTERVAL 8 DAY),
(4, 2, 70.00, 'cancelado', NOW() - INTERVAL 5 DAY),
(5, 4, 80.00, 'pago', NOW() - INTERVAL 3 DAY),
(6, 5, 15.00, 'pendente', NOW() - INTERVAL 1 DAY),
(7, 3, 120.00, 'pago', NOW() - INTERVAL 22 HOUR),
(8, 2, 250.00, 'pendente', NOW() - INTERVAL 5 HOUR);

-- 5. Inserir Itens do Pedido
INSERT INTO `pedido_itens` (`pedido_id`, `produto_id`, `nome_produto`, `preco`, `quantidade`, `imagem`) VALUES
-- Pedido 1
(1, 1, 'Bola de Futebol Oficial', 120.00, 1, '/products/soccer.avif'),
(1, 2, 'Camisola de Futebol', 85.50, 1, '/products/placeholder.jpg'),
-- Pedido 2
(2, 3, 'Bola de Basquetebol', 95.00, 1, '/products/placeholder.jpg'),
-- Pedido 3
(3, 4, 'Sapatilhas de Corrida', 250.00, 1, '/products/placeholder.jpg'),
(3, 5, 'Calções de Corrida', 40.00, 1, '/products/placeholder.jpg'),
-- Pedido 4
(4, 7, 'Fato de Banho', 70.00, 1, '/products/placeholder.jpg'),
-- Pedido 5
(5, 8, 'Halteres 5kg (Par)', 55.00, 1, '/products/placeholder.jpg'),
(5, 9, 'Tapete de Yoga', 25.00, 1, '/products/placeholder.jpg'),
-- Pedido 6
(6, 10, 'Garrafa de Água 1L', 15.00, 1, '/products/placeholder.jpg'),
-- Pedido 7
(7, 1, 'Bola de Futebol Oficial', 120.00, 1, '/products/soccer.avif'),
-- Pedido 8
(8, 4, 'Sapatilhas de Corrida', 250.00, 1, '/products/placeholder.jpg');

COMMIT;

SELECT 'Banco de dados populado com sucesso!' as status;