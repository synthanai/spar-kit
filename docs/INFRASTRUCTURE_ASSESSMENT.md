# Infrastructure Capacity Assessment

**Document**: TASK-107  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Purpose**: Assess hardware/software requirements for ultrathink integration

---

## 🎯 Summary

SPAR-Kit with ultrathink capabilities can run on standard development hardware. The local-first architecture (Ollama + DeepSeek-R1) eliminates cloud dependency while maintaining full functionality.

---

## 💻 Hardware Requirements

### Minimum Requirements

| Component | Minimum | Recommended | Optimal |
|-----------|---------|-------------|---------|
| **CPU** | 4 cores | 8 cores | 12+ cores |
| **RAM** | 8 GB | 16 GB | 32 GB |
| **Storage** | 20 GB free | 50 GB free | 100 GB+ SSD |
| **GPU** | Not required | NVIDIA 8GB+ VRAM | NVIDIA 16GB+ VRAM |

### Model-Specific Requirements

| Model | RAM (CPU mode) | VRAM (GPU mode) | Speed |
|-------|---------------|-----------------|-------|
| DeepSeek-R1:7b | 8 GB | 6 GB | 15-30 tok/s |
| DeepSeek-R1:14b | 16 GB | 12 GB | 8-15 tok/s |
| DeepSeek-R1:32b | 32 GB | 24 GB | 3-8 tok/s |
| Mistral 7B | 8 GB | 6 GB | 20-40 tok/s |
| Llama 3.1 8B | 8 GB | 6 GB | 18-35 tok/s |

### Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| macOS (Apple Silicon) | ✅ Full support | Metal acceleration |
| macOS (Intel) | ✅ Supported | CPU-only for Ollama |
| Linux (x64) | ✅ Full support | CUDA for NVIDIA |
| Windows 11 | ✅ Supported | WSL2 or native |
| Windows 10 | ⚠️ Limited | WSL2 required |

---

## 📦 Software Requirements

### Core Dependencies

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x+ | CLI runtime |
| npm | 9.x+ | Package management |
| Ollama | 0.3.x+ | Local LLM runtime |

### Optional Dependencies

| Software | Version | Purpose |
|----------|---------|---------|
| CUDA Toolkit | 12.x | NVIDIA GPU acceleration |
| Metal | macOS 13+ | Apple GPU acceleration |
| Docker | 24.x+ | Containerized deployment |

### Node.js Dependencies (package.json)

```json
{
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^12.0.0",
    "inquirer": "^9.2.0",
    "ink": "^4.4.1",
    "ink-select-input": "^5.0.0",
    "ink-spinner": "^5.0.0",
    "ink-text-input": "^5.0.1",
    "react": "^18.2.0",
    "uuid": "^9.0.0",
    "zustand": "^4.5.0"
  }
}
```

---

## 🔧 Installation Steps

### 1. Node.js + SPAR-Kit

```bash
# Install Node.js (if not present)
brew install node  # macOS
# or
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs  # Debian/Ubuntu

# Install SPAR-Kit
npm install -g @synthanai/spar-kit
```

### 2. Ollama + Models

```bash
# Install Ollama
brew install ollama  # macOS
# or
curl -fsSL https://ollama.ai/install.sh | sh  # Linux

# Start Ollama service
ollama serve

# Pull ultrathink model
ollama pull deepseek-r1:7b

# Optional: Pull standard models
ollama pull mistral:latest
ollama pull llama3.1:latest
```

### 3. Verification

```bash
# Verify SPAR-Kit
sparkit --version

# Verify Ollama
ollama list

# Test ultrathink
sparkit debate start "Test decision" --provider ollama_ultrathink
```

---

## 📊 Capacity Planning

### Single User

| Metric | Value |
|--------|-------|
| Disk per session | ~50-200 KB |
| Memory during debate | ~8-16 GB (model dependent) |
| Debates per day | Unlimited |
| Storage per month | ~50 MB (100 sessions) |

### Team (10 users)

| Metric | Value |
|--------|-------|
| Total storage | ~500 MB/month |
| Concurrent debates | Limited by hardware |
| Shared model server | 1x Ollama instance |

### Enterprise (100+ users)

| Metric | Value |
|--------|-------|
| Deployment | Distributed Ollama or cloud hybrid |
| Storage | Centralized session store |
| Model serving | Dedicated GPU server or cloud |

---

## ⚡ Performance Benchmarks

### DeepSeek-R1:7b on Apple M3 Pro

| Phase | Duration | Tokens |
|-------|----------|--------|
| SCOPE | 5-10s | 200-400 |
| POPULATE | 10-20s | 400-800 |
| ANNOUNCE | 5-10s | 200-400 |
| RUMBLE (per round) | 30-60s | 1000-2000 |
| KNIT | 20-40s | 600-1200 |
| INTERROGATE | 15-30s | 400-800 |
| TRANSMIT | 10-20s | 300-600 |
| **Total (3 rounds)** | **3-5 min** | **5000-10000** |

### Ultrathink Mode Overhead

| Mode | Time Multiplier | Token Multiplier |
|------|-----------------|------------------|
| Standard | 1x | 1x |
| Ultrathink | 1.5-2x | 2-3x |
| Maximum | 2-3x | 3-5x |

---

## 🔄 Scaling Options

### Vertical Scaling (Single Machine)

1. Add RAM for larger models
2. Add GPU for acceleration
3. Use SSD for faster session I/O

### Horizontal Scaling (Multiple Machines)

1. Ollama can run on dedicated server
2. Multiple SPAR-Kit clients connect to one Ollama
3. Cloud hybrid for burst capacity

### Cloud Fallback

When local resources insufficient:
- OpenAI o1/o3 for premium ultrathink
- Anthropic Claude for standard
- Google Gemini for cost-effective

---

## ✅ Readiness Checklist

- [ ] Node.js 18+ installed
- [ ] Ollama installed and running
- [ ] DeepSeek-R1:7b model pulled
- [ ] 16 GB+ RAM available
- [ ] 50 GB+ disk space free
- [ ] SPAR-Kit installed globally
- [ ] Test debate completed successfully

---

*SPAR-Kit Infrastructure Assessment v1.0.0 — TASK-107 — 2026-01-14*
