// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Wallet Connection (MetaMask)
const walletBtn = document.getElementById("walletBtn");
const walletAddress = document.getElementById("walletAddress");

if (walletBtn) {
  walletBtn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected. Install it first.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      walletAddress.textContent =
        "Connected: " +
        address.slice(0, 6) +
        "..." +
        address.slice(-4);

      walletBtn.textContent = "Wallet Connected";
      walletBtn.disabled = true;
    } catch (error) {
      console.error(error);
      alert("Wallet connection failed");
    }
  });
}

// On-chain User Analytics
function trackOnchainUser(address) {
    const analyticsKey = "onchain_users";
    const chainId = window.ethereum.chainId;
  
    const users = JSON.parse(localStorage.getItem(analyticsKey)) || {};
  
    if (!users[address]) {
      users[address] = {
        firstVisit: new Date().toISOString(),
        visits: 1,
        chainId: chainId,
      };
    } else {
      users[address].visits += 1;
      users[address].lastVisit = new Date().toISOString();
    }
  
    localStorage.setItem(analyticsKey, JSON.stringify(users));
  }
  
  // Hook into wallet connection
  if (walletBtn) {
    walletBtn.addEventListener("click", async () => {
      if (typeof window.ethereum === "undefined") return;
  
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
  
      trackOnchainUser(accounts[0]);
    });
  }

  function updateChainStatus(chainId) {
    const chainText = document.getElementById("chainText");
    const chainDot = document.getElementById("chainDot");
  
    const chains = {
      "0x1": "Ethereum",
      "0x2105": "Base",
      "0xa4b1": "Arbitrum",
      "0x89": "Polygon",
      "0xa": "Optimism"
    };
  
    chainText.textContent = chains[chainId] || "Unknown chain";
    chainDot.style.background = "#6cf2c2";
  }
  
  if (window.ethereum) {
    window.ethereum.on("chainChanged", updateChainStatus);
  }

  function renderWalletCard(address, chainId) {
    document.getElementById("walletCardAddress").textContent =
      address.slice(0, 6) + "..." + address.slice(-4);
  
    document.getElementById("walletCardChain").textContent =
      "Chain: " + getChainName(chainId);
  }

  renderWalletCard(address, window.ethereum.chainId);

  function updateWalletCount() {
    const users = JSON.parse(localStorage.getItem("onchain_users")) || {};
    document.getElementById("walletCount").textContent =
      Object.keys(users).length;
  }
  
  updateWalletCount();

  document.getElementById("onchainBadge").style.display = "inline-block";

  // Candlestick Analytics Chart
const chartContainer = document.getElementById("chart");

if (chartContainer) {
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: {
      background: { color: "transparent" },
      textColor: "#cfcfcf",
    },
    grid: {
      vertLines: { color: "rgba(255,255,255,0.05)" },
      horzLines: { color: "rgba(255,255,255,0.05)" },
    },
    timeScale: {
      borderColor: "rgba(255,255,255,0.1)",
    },
    rightPriceScale: {
      borderColor: "rgba(255,255,255,0.1)",
    },
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: "#6cf2c2",
    downColor: "#ff6b6b",
    borderUpColor: "#6cf2c2",
    borderDownColor: "#ff6b6b",
    wickUpColor: "#6cf2c2",
    wickDownColor: "#ff6b6b",
  });

  // Mock on-chain activity data (visual analytics)
  candleSeries.setData([
    { time: "2026-01-01", open: 30, high: 42, low: 28, close: 38 },
    { time: "2026-01-02", open: 38, high: 45, low: 35, close: 41 },
    { time: "2026-01-03", open: 41, high: 50, low: 39, close: 47 },
    { time: "2026-01-04", open: 47, high: 49, low: 40, close: 42 },
    { time: "2026-01-05", open: 42, high: 55, low: 41, close: 53 },
  ]);

  chart.timeScale().fitContent();
}
