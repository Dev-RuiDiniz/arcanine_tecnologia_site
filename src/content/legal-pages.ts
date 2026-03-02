export type LegalPageSlug = "politica-de-privacidade" | "termos-de-uso";

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalPageContent = {
  slug: LegalPageSlug;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

const legalPages: Record<LegalPageSlug, LegalPageContent> = {
  "politica-de-privacidade": {
    slug: "politica-de-privacidade",
    title: "Politica de Privacidade",
    description:
      "Entenda como coletamos, usamos e protegemos os dados pessoais em nossos canais digitais.",
    updatedAt: "2026-03-02",
    sections: [
      {
        heading: "1. Dados coletados",
        body: [
          "Coletamos dados fornecidos por voce em formularios de contato, como nome, e-mail, telefone e mensagem.",
          "Tambem podemos registrar dados tecnicos basicos para seguranca e analise operacional.",
        ],
      },
      {
        heading: "2. Finalidade do uso",
        body: [
          "Os dados sao utilizados para responder solicitacoes, executar atendimento comercial e melhorar a experiencia em nossos servicos.",
          "Nao vendemos dados pessoais a terceiros.",
        ],
      },
      {
        heading: "3. Compartilhamento e seguranca",
        body: [
          "Dados podem ser compartilhados com provedores tecnicos estritamente necessarios para operacao da plataforma.",
          "Adotamos medidas tecnicas para proteger informacoes contra acesso nao autorizado.",
        ],
      },
      {
        heading: "4. Direitos do titular",
        body: [
          "Voce pode solicitar acesso, correcao ou exclusao dos dados pessoais tratados por nossos sistemas.",
          "Para exercer seus direitos, entre em contato pelos canais oficiais disponiveis na pagina de contato.",
        ],
      },
    ],
  },
  "termos-de-uso": {
    slug: "termos-de-uso",
    title: "Termos de Uso",
    description:
      "Regras para uso dos conteudos e servicos disponibilizados nos canais digitais da Arcanine Tecnologia.",
    updatedAt: "2026-03-02",
    sections: [
      {
        heading: "1. Aceitacao",
        body: [
          "Ao acessar este site, voce concorda com os termos e condicoes descritos neste documento.",
          "Se nao concordar com os termos, interrompa a utilizacao dos servicos.",
        ],
      },
      {
        heading: "2. Uso permitido",
        body: [
          "O conteudo deste site destina-se a fins informativos e comerciais legitimos.",
          "E vedado utilizar o site para atividades ilicitas ou que prejudiquem sua disponibilidade.",
        ],
      },
      {
        heading: "3. Propriedade intelectual",
        body: [
          "Textos, marcas, layout e demais elementos do site sao protegidos por direitos aplicaveis.",
          "Reproducao sem autorizacao previa e proibida, salvo hipoteses legais especificas.",
        ],
      },
      {
        heading: "4. Limitacao de responsabilidade",
        body: [
          "Empenhamos esforcos para manter informacoes atualizadas, mas nao garantimos ausencia total de erros.",
          "Nao nos responsabilizamos por danos indiretos decorrentes do uso indevido da plataforma.",
        ],
      },
    ],
  },
};

export const getLegalPage = (slug: LegalPageSlug) => legalPages[slug];

export const listLegalPages = () => Object.values(legalPages);
