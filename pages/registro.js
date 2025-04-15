import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "loja_desportiva",
    });

    // Verifica se o email já existe
    const [existingUser] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      await connection.end();
      return res.status(400).json({ error: "Este email já está cadastrado!" });
    }

    // Encripta a senha
    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    // Insere o novo usuário
    await connection.execute(
      "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      [nome, email, hashedSenha, "user"]
    );

    await connection.end();
    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return res.status(500).json({ error: "Erro no servidor. Verifique o terminal." });
  }
}
