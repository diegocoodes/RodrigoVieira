# Fontes e atribuições de terceiros

Este arquivo registra a origem dos componentes e recursos adaptados à landing page da Mentoria Rodrigo Vieira. As atribuições abaixo não declaram nem substituem a licença de cada recurso.

## Componentes obtidos no 21st.dev

### Spotlight

- Autoria indicada no catálogo: **manuarora700**.
- Origem: [Spotlight no 21st.dev](https://21st.dev/@manuarora700/components/spotlight).
- Demo consultada: `989`.
- Adaptações: iluminação em dourado sobre o fundo escuro, integração ao CSS local, intensidade compatível com as fotografias coloridas e respeito à preferência por movimento reduzido.

### Animated Tabs

- Autoria indicada no catálogo: **educalvolpz**.
- Origem: [Animated Tabs no 21st.dev](https://21st.dev/@educalvolpz/components/animated-tabs).
- Demo consultada: `24930`.
- Adaptações: conteúdo do programa de mentoria, paleta preta e dourada, animações com `motion`, navegação por teclado, estados de seleção e foco e comportamento com movimento reduzido.
- Estado atual: componente preservado na biblioteca local; a seção do programa foi substituída pela grade de seis cards solicitada na nova referência visual.

Não foi inferida uma licença específica para esses dois componentes a partir do material retornado. A identificação dos autores e os links das fontes são preservados aqui.

As duas consultas de código consumiram exatamente as duas recuperações incluídas na cota gratuita utilizada nesta atualização. O retorno da segunda consulta informou `0/2` restantes. As buscas de catálogo foram gratuitas.

## Referências visuais de tipografia

Os previews e descrições de [Blur Out Up, por educalvolpz](https://21st.dev/@educalvolpz/components/blur-out-up), [Blur In Text, por animbits](https://21st.dev/@animbits/components/text-blur-in) e [Text Reveal, por ddoemonn](https://21st.dev/@ddoemonn/components/text-reveal) orientaram a direção visual dos títulos. `AnimatedWords.tsx` é uma implementação local com CSS e IntersectionObserver; não houve recuperação de código desses componentes. A consulta de uso confirmou `0/2` recuperações gratuitas restantes. O Spotlight já integrado foi reutilizado na seção de acompanhamento e imersão.

## Dependência de animação

`motion` é utilizado no componente reutilizável Animated Tabs preservado na biblioteca local. A dependência é declarada no projeto e deve manter seus próprios avisos e arquivos de licença fornecidos no pacote. Este documento não atribui uma licença adicional à dependência nem aos componentes adaptados.

## Efeito de vaporização fornecido pelo cliente

O código `vapour-text-effect.tsx` foi fornecido no briefing complementar pelo cliente, sem nova consulta de código ao 21st.dev. A adaptação mantém a amostragem de pixels do texto, a vaporização direcional e o movimento das partículas, com execução única na entrada, nome Rodrigo Vieira, limite de resolução, movimento reduzido e limpeza dos recursos do navegador. Não foi inferida uma autoria ou licença adicional que não constasse no material recebido.

## Fontes tipográficas

- **Manrope**: arquivo servido localmente; aviso de licença incluído em [public/fonts/Manrope-OFL.txt](public/fonts/Manrope-OFL.txt).
- **Barlow Condensed**: arquivo servido localmente; aviso de licença incluído em [public/fonts/BarlowCondensed-OFL.txt](public/fonts/BarlowCondensed-OFL.txt).

## Fotografias

As fotografias de Rodrigo Vieira foram fornecidas pelo cliente ou obtidas do site indicado no briefing. Os arquivos originais foram preservados. Sua inclusão no projeto não representa a concessão de uma licença pública de reutilização das imagens.
