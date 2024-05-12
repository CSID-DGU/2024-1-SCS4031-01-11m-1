import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
.markDown{
  *{font-size:2rem}
  hr{
margin: 2rem 0;
  }
  p{
    padding: 2rem 0;
    line-height: 120%;
  }
  strong{
    font-weight: 900;
  }
  em{
    font-style: italic;
  }
  h1{
    font-size: 4rem;
    padding: 2rem 0;
  }
  h2{
    font-size: 3.5rem;
    padding: 2rem 0;
  }
  h3{
    font-size: 3.0rem;
    padding: 2rem 0;
  }
  h4{
    font-size: 3.0rem;
    padding: 2rem 0;
  }
  h5{
    font-size: 2.5rem;
    padding: 2rem 0;
  }
  h6{
    font-size: 1.5rem;
    padding: 1rem 0;
  }
  a{
    color: blue;
  }
  img{
    width: 100%;
    margin: 1rem 0;
  }
}
  :root {
    --vh: 100%;
   }

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, 
  a, abbr, acronym, address, big, cite, 
  del, em, strong, dfn,  img, ins, kbd, q, s, samp,
  small, strike,  sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {

    @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    } 
    margin: 0;
    border: 0;
    padding: 0;
    vertical-align: baseline;
    font: inherit;
    font-size: 10px;
    @media (max-width: 768px) {
        font-size: 7px;
    }
    font-family: "Pretendard-Regular";
  }
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  *[hidden] {
      display: none;
  }

  body {
    touch-action: manipulation;
    line-height: 1;
    // 가운데 정렬
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  /* 위에가 styled-reset 내용 */

  * {
    box-sizing: border-box;
  } 
  html {
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
    
    scroll-behavior: smooth;

    font-family: sans-serif;
    /* font-size: 62.5%; */
    user-select: none;
    /* @media (min-width:1800px){
      font-size: 62.5%;
    }
    @media (min-width:1420px) and (max-width:1799px){
      font-size: 46.8%;
    }
    @media (min-width:900px) and (max-width:1419px){
      font-size: 42%;
    }
    @media (min-width: 768px) and (max-width:899px){ 
      font-size: 35%;
    }
    @media (max-width:767px){ 
      font-size: 32%;
    } */
    

  }
  ul, li {
    padding-left: 0rem;
    list-style: none;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  input, button {
    outline: none; 
    border: none;
    background-color: transparent;
  }
  button {
    cursor: pointer;
    padding: 0;
  }
  input {
    appearance: none;
    
    &:focus {
      outline: none;
    }
  }
  select{
    border: none;
    &:focus {
      outline: none;
    }
  }

  .scroll::-webkit-scrollbar {
    display: none;
  }

  .scroll {
    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */
  }


@font-face {
  font-family: "Wanted Sans";
  font-weight: normal;
  src: url("./fonts/WantedSans-Regular.ttf") format("truetype");
}
body {
  font-family: "Wanted Sans";
}

@font-face {
  font-family: "Pretendard";
  font-weight: normal;
  src: url("./fonts/PretendardVariable.ttf") format("truetype");
}
body {
  font-family: "Pretedard";
}
`;