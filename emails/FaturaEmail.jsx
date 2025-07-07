import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Row,
  Column,
  Section,
  Hr,
} from '@react-email/components';
import * as React from 'react';

export const FaturaEmail = ({ fatura }) => (
  <Html>
    <Head />
    <Preview>Sua Fatura da Loja Desportiva</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Fatura</Heading>
        <Text style={text}>
          Olá <strong>{fatura.cliente.nome}</strong>,
        </Text>
        <Text style={text}>Obrigado pela sua compra. Aqui estão os detalhes da sua fatura.</Text>

        <Section style={invoiceInfo}>
          <Row>
            <Column>
              <Text style={label}>Número da Fatura:</Text>
              <Text style={value}>{fatura.numero}</Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={label}>Data da Fatura:</Text>
              <Text style={value}>{fatura.data}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={label}>NIF:</Text>
              <Text style={value}>{fatura.cliente.nif}</Text>
            </Column>
          </Row>
        </Section>

        <Hr />

        <Section>
          <Heading as="h2" style={h2}>
            Itens
          </Heading>
          {fatura.itens.map(item => (
            <Row key={item.id} style={itemRow}>
              <Column>{item.nome}</Column>
              <Column style={{ textAlign: 'right' }}>
                {item.quantidade} x {item.preco_unitario.toFixed(2)} €
              </Column>
            </Row>
          ))}
        </Section>

        <Hr />

        <Section style={totals}>
          <Row>
            <Column style={label}>Subtotal</Column>
            <Column style={{ textAlign: 'right' }}>{fatura.subtotal.toFixed(2)} €</Column>
          </Row>
          <Row>
            <Column style={label}>Desconto</Column>
            <Column style={{ textAlign: 'right' }}>-{fatura.desconto.toFixed(2)} €</Column>
          </Row>
          <Row>
            <Column style={label}>Entrega</Column>
            <Column style={{ textAlign: 'right' }}>{fatura.entrega.toFixed(2)} €</Column>
          </Row>
          <Row style={totalRow}>
            <Column style={label}>Total</Column>
            <Column style={{ textAlign: 'right' }}>{fatura.total.toFixed(2)} €</Column>
          </Row>
        </Section>

        <Hr />

        <Text style={footer}>Loja Desportiva - Rua Fictícia, 123, 1234-567 Lisboa</Text>
      </Container>
    </Body>
  </Html>
);

export default FaturaEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #e6ebf1',
  borderRadius: '5px',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
  textAlign: 'center',
};

const h2 = {
  color: '#1d1c1d',
  fontSize: '24px',
  fontWeight: '700',
  margin: '20px 0',
};

const text = {
  color: '#5e5e5e',
  fontSize: '16px',
  lineHeight: '24px',
};

const label = {
  ...text,
  fontWeight: '700',
};

const value = {
  ...text,
};

const invoiceInfo = {
  padding: '0 20px',
};

const itemRow = {
  padding: '5px 20px',
};

const totals = {
  padding: '0 20px',
};

const totalRow = {
  fontWeight: '700',
  marginTop: '10px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center',
};
