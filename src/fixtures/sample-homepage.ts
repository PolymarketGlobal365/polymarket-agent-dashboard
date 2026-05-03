export const SAMPLE_POLYMARKET_HOMEPAGE_HTML = `
<!doctype html>
<html lang="en">
  <body>
    <section>
      <h2>Trending</h2>
      <div class="relative flex flex-col justify-between rounded-xl shadow-md border">
        <div class="flex w-full items-start relative gap-2 px-3 h-[42px]">
          <div class="overflow-hidden rounded-sm relative w-[38px] min-w-[38px] h-[38px]">
            <img alt="Will Crude Oil card icon" src="https://example.com/crude.png" />
          </div>
          <div class="flex flex-1 min-w-0 gap-4 justify-between cursor-default">
            <a href="/event/will-crude-oil-cl-hit-by-end-of-march">
              <h2>Will Crude Oil (CL) hit $100 by end of March?</h2>
            </a>
          </div>
        </div>
        <div class="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div class="flex justify-between items-center gap-4 w-full h-fit shrink-0">
            <div class="flex flex-1 gap-2 items-center min-w-0 group cursor-pointer">
              <a href="/event/will-crude-oil-cl-hit-by-end-of-march/will-crude-oil-cl-hit-high-100?marketSlug=a"><p>Hit $100</p></a>
            </div>
            <div class="flex justify-end gap-1 items-center">
              <a href="/event/will-crude-oil-cl-hit-by-end-of-march?marketSlug=a&outcomeIndex=0"><span>67%</span></a>
              <a href="/event/will-crude-oil-cl-hit-by-end-of-march?marketSlug=a&outcomeIndex=1"><span>33%</span></a>
            </div>
          </div>
          <div class="flex justify-between items-center gap-4 w-full h-fit shrink-0">
            <div class="flex flex-1 gap-2 items-center min-w-0 group cursor-pointer">
              <a href="/event/will-crude-oil-cl-hit-by-end-of-march/will-crude-oil-cl-hit-high-105?marketSlug=b"><p>Hit $105</p></a>
            </div>
            <div class="flex justify-end gap-1 items-center">
              <a href="/event/will-crude-oil-cl-hit-by-end-of-march?marketSlug=b&outcomeIndex=0"><span>42%</span></a>
              <a href="/event/will-crude-oil-cl-hit-by-end-of-march?marketSlug=b&outcomeIndex=1"><span>58%</span></a>
            </div>
          </div>
          <p>$44M Vol.</p>
        </div>
      </div>
      <div class="relative flex flex-col justify-between rounded-xl shadow-md border">
        <div class="flex w-full items-start relative gap-2 px-3 h-[42px]">
          <div class="overflow-hidden rounded-sm relative w-[38px] min-w-[38px] h-[38px]">
            <img alt="Fed card icon" src="https://example.com/fed.png" />
          </div>
          <div class="flex flex-1 min-w-0 gap-4 justify-between cursor-default">
            <a href="/event/will-the-fed-cut-rates-in-june">
              <h2>Will the Fed cut rates in June?</h2>
            </a>
          </div>
        </div>
        <div class="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div class="flex justify-between items-center gap-4 w-full h-fit shrink-0">
            <div class="flex flex-1 gap-2 items-center min-w-0 group cursor-pointer">
              <a href="/event/will-the-fed-cut-rates-in-june/rates-cut?marketSlug=c"><p>Yes in June</p></a>
            </div>
            <div class="flex justify-end gap-1 items-center">
              <a href="/event/will-the-fed-cut-rates-in-june?marketSlug=c&outcomeIndex=0"><span>54%</span></a>
              <a href="/event/will-the-fed-cut-rates-in-june?marketSlug=c&outcomeIndex=1"><span>46%</span></a>
            </div>
          </div>
          <p>$18M Vol.</p>
        </div>
      </div>
    </section>
    <section>
      <h2>Politics</h2>
      <div class="relative flex flex-col justify-between rounded-xl shadow-md border">
        <div class="flex w-full items-start relative gap-2 px-3 h-[42px]">
          <a href="/event/will-biden-drop-out-before-convention">
            <h2>Will Biden drop out before convention?</h2>
          </a>
        </div>
        <div class="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div class="flex justify-between items-center gap-4 w-full h-fit shrink-0">
            <div class="flex flex-1 gap-2 items-center min-w-0 group cursor-pointer">
              <a href="/event/will-biden-drop-out-before-convention/drop-out?marketSlug=d"><p>Drop out</p></a>
            </div>
            <div class="flex justify-end gap-1 items-center">
              <a href="/event/will-biden-drop-out-before-convention?marketSlug=d&outcomeIndex=0"><span>21%</span></a>
              <a href="/event/will-biden-drop-out-before-convention?marketSlug=d&outcomeIndex=1"><span>79%</span></a>
            </div>
          </div>
          <p>$8M Vol.</p>
        </div>
      </div>
      <div class="relative flex flex-col justify-between rounded-xl shadow-md border">
        <div class="flex w-full items-start relative gap-2 px-3 h-[42px]">
          <a href="/event/will-solana-hit-300-by-july">
            <h2>Will Solana hit $300 by July?</h2>
          </a>
        </div>
        <div class="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div class="flex justify-between items-center gap-4 w-full h-fit shrink-0">
            <div class="flex flex-1 gap-2 items-center min-w-0 group cursor-pointer">
              <a href="/event/will-solana-hit-300-by-july/yes?marketSlug=e"><p>Reach $300</p></a>
            </div>
            <div class="flex justify-end gap-1 items-center">
              <a href="/event/will-solana-hit-300-by-july?marketSlug=e&outcomeIndex=0"><span>37%</span></a>
              <a href="/event/will-solana-hit-300-by-july?marketSlug=e&outcomeIndex=1"><span>63%</span></a>
            </div>
          </div>
          <p>$29M Vol.</p>
        </div>
      </div>
    </section>
  </body>
</html>
`;
