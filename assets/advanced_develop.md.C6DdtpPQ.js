import{_ as e,c as a,o as i,ae as t}from"./chunks/framework.BHrE6nLq.js";const k=JSON.parse('{"title":"Develop","description":"","frontmatter":{},"headers":[],"relativePath":"advanced/develop.md","filePath":"advanced/develop.md","lastUpdated":1737715473000}'),n={name:"advanced/develop.md"};function l(p,s,d,o,h,c){return i(),a("div",null,s[0]||(s[0]=[t(`<h1 id="develop" tabindex="-1">Develop <a class="header-anchor" href="#develop" aria-label="Permalink to &quot;Develop&quot;">​</a></h1><h2 id="as-dependence" tabindex="-1">As dependence <a class="header-anchor" href="#as-dependence" aria-label="Permalink to &quot;As dependence&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pnpm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> kotori-bot</span></span></code></pre></div><p>Of course, you can also install <code>@kotori-bot/core</code> or <code>@kotori-bot/loader</code> by according your needs, about the difference and modifications between them, see <a href="./architecture.html">architecture</a>.</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">import</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> Loader</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;"> from</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">kotori-bot</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">const </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">loader</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> =</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> new </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">Loader</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">loader</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">run</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">true</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span></code></pre></div><h2 id="secondary-development" tabindex="-1">Secondary development <a class="header-anchor" href="#secondary-development" aria-label="Permalink to &quot;Secondary development&quot;">​</a></h2><p>1.Clone the repository</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> clone</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> https://github.com/kotorijs/kotori</span></span></code></pre></div><p>2.Install dependencies</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pnpm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span></span></code></pre></div><p>3.Run</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pnpm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> dev</span></span></code></pre></div><p>Other scripts:</p><ul><li><code>serve</code> Start with production environment</li><li><code>build</code> Build all packages at the workspace</li><li><code>dev:only</code> Only start else <code>nodemon</code></li><li><code>pub</code> Publish all packages at the workspace base <code>public</code> access</li><li><code>test</code> Run all unit tests at the workspace</li><li><code>version</code> Generate <code>CHANGELOG.md</code></li></ul>`,14)]))}const v=e(n,[["render",l]]);export{k as __pageData,v as default};
