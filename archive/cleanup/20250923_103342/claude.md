Task:
Implement a dynamic Dune embed system for blog posts on matthewraphael.xyz that allows me to embed any Dune query via placeholders in blog content. The system should use the existing admin panel to manage embed URLs and should not touch any other website functionality.

Requirements:

Dynamic Placeholders:

Use placeholders in blog content with the format:
{{embed_query:<key>}}

<key> can represent any metric or query (e.g., active_wallets, total_transactions, average_gas_fee, top_protocols).

At render time, replace each placeholder with the corresponding iframe using the URL stored in the admin panel.

Admin Panel Integration:

Reuse the existing admin panel to store embed URLs for each <key>.

Allow optional configuration of width, height, and captions per query.

Adding a new query should require only updating the admin panel, no code changes.

Iframe Embedding:

Generate iframe HTML dynamically for each query:

<iframe src="URL_FROM_ADMIN" width="100%" height="400" frameborder="0" allowfullscreen></iframe>


Iframes must be fully responsive and preserve interactivity of Dune charts.

Security & Best Practices:

Validate embed URLs to prevent XSS or injection attacks.

Follow industry-standard, maintainable, modular code practices (Meta/Amazon/Netflix level).

Make the system scalable for any number of queries or placeholders.

Non-Intrusive Implementation:

Do not modify any existing core logic, routing, or other website functionality.

Only affect blog rendering and Dune embed management.

Documentation & Examples:

Comment the code explaining how placeholders are parsed and replaced.

Include instructions for adding new queries in the admin panel.

Provide an example blog post showing 3–4 dynamic Dune embeds with placeholders and live iframe rendering.

Outcome:
After implementation, content creators should be able to:

Insert placeholders anywhere in a blog post: {{embed_query:<key>}}.

Update or add embed URLs via the admin panel without editing blog HTML.

Render the correct Dune charts dynamically, fully responsive and interactive.



you can access dune docs for more information, the above is the suggested plan from ChatGPT