-- 01-schema.sql

CREATE DATABASE IF NOT EXISTS `loja_desportiva`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `loja_desportiva`;

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `data_criacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` TEXT DEFAULT NULL,
  `preco` DECIMAL(10,2) NOT NULL,
  `imagem` VARCHAR(255) DEFAULT NULL,
  `categoria_id` INT(11) NOT NULL,
  `estoque` INT(11) NOT NULL DEFAULT 0,
  `ativo` BOOLEAN DEFAULT TRUE,
  `data_criacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `fk_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','user') DEFAULT 'user',
  `ativo` BOOLEAN DEFAULT TRUE,
  `ultimo_login` DATETIME DEFAULT NULL,
  `data_criacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `passwordResetToken` VARCHAR(255) DEFAULT NULL,
  `passwordResetExpires` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Endereços dos Usuários
CREATE TABLE IF NOT EXISTS `moradas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `nome_morada` VARCHAR(100) NOT NULL,
  `rua` VARCHAR(255) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(100) DEFAULT NULL,
  `conselho` VARCHAR(100) NOT NULL,
  `distrito` VARCHAR(50) NOT NULL,
  `codigo_postal` VARCHAR(20) NOT NULL,
  `is_principal` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_morada_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Cupons de Desconto
CREATE TABLE IF NOT EXISTS `cupons` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL,
  `tipo` ENUM('percentual', 'fixo') NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `data_validade` DATE NOT NULL,
  `usos_maximos` INT(11) DEFAULT NULL,
  `usos_atuais` INT(11) DEFAULT 0,
  `ativo` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `morada_id` INT(11) NOT NULL,
  `cupom_id` INT(11) DEFAULT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `valor_desconto` DECIMAL(10,2) DEFAULT 0.00,
  `valor_entrega` DECIMAL(10,2) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `metodo_pagamento` VARCHAR(50) NOT NULL,
  `status` ENUM('Pendente', 'Processando', 'Pago', 'Enviado', 'Concluído', 'Cancelado') DEFAULT 'Pendente',
  `data_criacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `morada_id` (`morada_id`),
  KEY `cupom_id` (`cupom_id`),
  CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pedidos_morada` FOREIGN KEY (`morada_id`) REFERENCES `moradas` (`id`),
  CONSTRAINT `fk_pedidos_cupom` FOREIGN KEY (`cupom_id`) REFERENCES `cupons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS `pedido_itens` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` INT(11) NOT NULL,
  `produto_id` INT(11) NOT NULL,
  `quantidade` INT(11) NOT NULL,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  CONSTRAINT `fk_pedido_item` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Favoritos
CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `produto_id` INT(11) NOT NULL,
  `data_criacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_product_unique` (`user_id`, `produto_id`),
  KEY `user_id` (`user_id`),
  KEY `produto_id` (`produto_id`),
  CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favoritos_produto` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
