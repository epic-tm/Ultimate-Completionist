// ============================================
// ULTIMATE COMPLETIONIST ACHIEVEMENT SYSTEM
// script.js
// ============================================

// Global achievements data
let achievementsData = null;

// Icon mapping for planets (fallback emojis)
const planetIcons = {
  'Physical': '🏃',
  'Exploration': '🗺️',
  'Mental': '🧠',
  'Social': '🤝',
  'Creative': '🎨'
};

// Tier names mapping
const tierNames = {
  1: 'Initiate',
  2: 'Challenger', 
  3: 'Warrior',
  4: 'Elite',
  5: 'Grandmaster'
};

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
  console.log('Achievement System Initialized');
  
  // Try to load saved progress first
  if (loadProgress()) {
    console.log('Loaded saved progress');
    populatePlanetSelector();
    displayAchievements(achievementsData.planets[0].planetName);
    updateStats();
  } else {
    console.log('No saved progress found. Using mock data.');
    useMockData();
  }
});

// ============================================
// LOAD ACHIEVEMENTS FROM JSON
// ============================================

async function loadFromJSON() {
  try {
    console.log('Attempting to load achievements.json...');
    const response = await fetch('achievements.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    achievementsData = await response.json();
    console.log('Successfully loaded achievements:', achievementsData);
    
    // Initialize if needed
    initializeAchievements();
    
    populatePlanetSelector();
    displayAchievements(achievementsData.planets[0].planetName);
    updateStats();
    
    alert('Achievements loaded successfully!');
    
  } catch (error) {
    console.error('Error loading achievements.json:', error);
    alert('Could not load achievements.json. Using demo data instead.\n\nMake sure achievements.json is in the same folder as index.html');
    useMockData();
  }
}

// ============================================
// MOCK DATA FOR DEMONSTRATION
// ============================================

function useMockData() {
  achievementsData = {
    planets: [
      {
        planetName: 'Physical',
        planetIcon: '🏃',
        description: 'Master your body and physical performance',
        tiers: [
          {
            tierNumber: 1,
            tierName: 'Initiate',
            achievements: [
              {
                id: 'physical_t1_a1',
                title: 'Morning Stretch',
                description: 'Do a 10-minute stretching routine for 7 days',
                tier: 1,
                planet: 'Physical',
                status: 'available',
                points: 75,
                dateCompleted: null
              },
              {
                id: 'physical_t1_a2',
                title: '10k Steps',
                description: 'Walk 10,000 steps in a single day',
                tier: 1,
                planet: 'Physical',
                status: 'available',
                points: 50,
                dateCompleted: null
              },
              {
                id: 'physical_t1_a3',
                title: 'Push-Up Starter',
                description: 'Complete 20 push-ups in one set',
                tier: 1,
                planet: 'Physical',
                status: 'available',
                points: 100,
                dateCompleted: null
              }
            ]
          },
          {
            tierNumber: 3,
            tierName: 'Warrior',
            achievements: [
              {
                id: 'physical_t3_a1',
                title: '10k Race',
                description: 'Complete a timed 10 km run',
                tier: 3,
                planet: 'Physical',
                status: 'locked',
                points: 500,
                dateCompleted: null
              }
            ]
          },
          {
            tierNumber: 5,
            tierName: 'Grandmaster',
            achievements: [
              {
                id: 'physical_t5_a1',
                title: 'Marathon Champion',
                description: 'Complete a full marathon (42.195 km)',
                tier: 5,
                planet: 'Physical',
                status: 'locked',
                points: 2000,
                dateCompleted: null
              }
            ]
          }
        ]
      },
      {
        planetName: 'Mental',
        planetIcon: '🧠',
        description: 'Master your mind and mental resilience',
        tiers: [
          {
            tierNumber: 1,
            tierName: 'Initiate',
            achievements: [
              {
                id: 'mental_t1_a1',
                title: 'Meditation Beginner',
                description: 'Meditate for 5 minutes daily for 7 days',
                tier: 1,
                planet: 'Mental',
                status: 'available',
                points: 75,
                dateCompleted: null
              }
            ]
          }
        ]
      }
    ]
  };
  
  populatePlanetSelector();
  displayAchievements('Physical');
  updateStats();
}

// ============================================
// INITIALIZE ACHIEVEMENTS
// ============================================

function initializeAchievements() {
  // Ensure all achievements have required fields
  achievementsData.planets.forEach(planet => {
    planet.tiers.forEach(tier => {
      tier.achievements.forEach(achievement => {
        if (!achievement.status) achievement.status = 'available';
        if (!achievement.dateCompleted) achievement.dateCompleted = null;
        if (!achievement.points) achievement.points = tier.tierNumber * 50;
      });
    });
  });
}

// ============================================
// POPULATE PLANET SELECTOR
// ============================================

function populatePlanetSelector() {
  const selector = document.getElementById('planetSelector');
  selector.innerHTML = '';
  
  achievementsData.planets.forEach((planet, index) => {
    const btn = document.createElement('button');
    btn.className = `planet-btn ${index === 0 ? 'active' : ''}`;
    
    const icon = planet.planetIcon || planetIcons[planet.planetName] || '⭐';
    btn.innerHTML = `${icon} ${planet.planetName}`;
    
    btn.onclick = () => {
      document.querySelectorAll('.planet-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      displayAchievements(planet.planetName);
    };
    
    selector.appendChild(btn);
  });
}

// ============================================
// DISPLAY ACHIEVEMENTS FOR PLANET
// ============================================

function displayAchievements(planetName) {
  const list = document.getElementById('achievementList');
  const planet = achievementsData.planets.find(p => p.planetName === planetName);
  
  if (!planet) {
    console.error('Planet not found:', planetName);
    return;
  }
  
  list.innerHTML = `
    <h3>${planet.planetIcon || '⭐'} ${planet.planetName} Achievements</h3>
  `;
  
  // Sort tiers by number
  const sortedTiers = [...planet.tiers].sort((a, b) => a.tierNumber - b.tierNumber);
  
  sortedTiers.forEach(tier => {
    // Tier header
    const tierHeader = document.createElement('div');
    tierHeader.className = 'tier-header';
    tierHeader.textContent = `Tier ${tier.tierNumber}: ${tier.tierName || tierNames[tier.tierNumber]}`;
    list.appendChild(tierHeader);
    
    // Achievements
    tier.achievements.forEach(achievement => {
      const item = document.createElement('div');
      item.className = `achievement-item ${achievement.status}`;
      
      const icon = planet.planetIcon || planetIcons[planet.planetName] || '⭐';
      
      item.innerHTML = `
        <div class="achievement-icon">${icon}</div>
        <div class="achievement-text">
          <div class="achievement-title" style="font-size: 10px;">${achievement.title}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
        <div class="tier-badge">T${achievement.tier} • ${achievement.points}pts</div>
      `;
      
      // Make clickable if available
      if (achievement.status === 'available') {
        item.onclick = () => unlockAchievement(achievement.id);
      }
      
      list.appendChild(item);
    });
  });
}

// ============================================
// SHOW ACHIEVEMENT NOTIFICATION
// ============================================

function showAchievementNotification(achievement, planet) {
  const container = document.getElementById('achievementContainer');
  
  // Create achievement element
  const achievementEl = document.createElement('div');
  achievementEl.className = 'achievement';
  achievementEl.setAttribute('data-tier', achievement.tier);
  
  // Get icon
  const icon = planet.planetIcon || planetIcons[planet.planetName] || '⭐';
  
  achievementEl.innerHTML = `
    <div class="achievement-border">
      <div class="border-topleft"></div>
      <div class="border-topmiddle"></div>
      <div class="border-topright"></div>
      <div class="border-middleleft"></div>
      <div class="border-middlemiddle"></div>
      <div class="border-middleright"></div>
      <div class="border-bottomleft"></div>
      <div class="border-bottommiddle"></div>
      <div class="border-bottomright"></div>
    </div>
    <div class="achievement-content-wrapper">
      <div class="achievement-icon">${icon}</div>
      <div class="achievement-text">
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-description">${achievement.description}</div>
      </div>
    </div>
  `;
  
  // Add to container
  container.appendChild(achievementEl);
  
  // Play sound (optional - requires achievement.mp3 file)
  try {
    const audio = new Audio('assets/sounds/achievement.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed (this is normal if no sound file):', e));
  } catch (e) {
    console.log('No sound file found');
  }
  
  // Remove after animation
  setTimeout(() => {
    achievementEl.remove();
  }, 5000);
}

// ============================================
// UNLOCK ACHIEVEMENT
// ============================================

function unlockAchievement(achievementId) {
  if (!achievementsData) return false;
  
  console.log('Attempting to unlock:', achievementId);
  
  // Find the achievement
  for (const planet of achievementsData.planets) {
    for (const tier of planet.tiers) {
      const achievement = tier.achievements.find(a => a.id === achievementId);
      
      if (achievement) {
        if (achievement.status === 'completed') {
          console.log('Achievement already completed');
          return false;
        }
        
        // Mark as completed
        achievement.status = 'completed';
        achievement.dateCompleted = new Date().toISOString();
        
        console.log('Achievement unlocked!', achievement);
        
        // Show notification
        showAchievementNotification(achievement, planet);
        
        // Update display
        displayAchievements(planet.planetName);
        updateStats();
        
        // Save progress
        saveProgress();
        
        return true;
      }
    }
  }
  
  console.error('Achievement not found:', achievementId);
  return false;
}

// ============================================
// TEST ACHIEVEMENT (For Demo Buttons)
// ============================================

function testAchievement(achievementId) {
  if (!achievementsData) {
    console.log('No data loaded, using mock data');
    useMockData();
  }
  
  // Find and show the achievement (even if locked/completed)
  for (const planet of achievementsData.planets) {
    for (const tier of planet.tiers) {
      const achievement = tier.achievements.find(a => a.id === achievementId);
      if (achievement) {
        showAchievementNotification(achievement, planet);
        return;
      }
    }
  }
  
  console.error('Achievement not found for testing:', achievementId);
  alert('Achievement not found: ' + achievementId);
}

// ============================================
// UPDATE STATS DISPLAY
// ============================================

function updateStats() {
  if (!achievementsData) return;
  
  let completed = 0;
  let total = 0;
  let totalPoints = 0;
  
  achievementsData.planets.forEach(planet => {
    planet.tiers.forEach(tier => {
      tier.achievements.forEach(achievement => {
        total++;
        if (achievement.status === 'completed') {
          completed++;
          totalPoints += achievement.points || 0;
        }
      });
    });
  });
  
  // Calculate level (every 1000 points = 1 level)
  const level = Math.floor(totalPoints / 1000) + 1;
  
  // Update display
  document.getElementById('progressValue').textContent = `${completed}/${total}`;
  document.getElementById('pointsValue').textContent = totalPoints;
  document.getElementById('levelValue').textContent = level;
}

// ============================================
// SAVE PROGRESS TO LOCALSTORAGE
// ============================================

function saveProgress() {
  try {
    localStorage.setItem('achievementProgress', JSON.stringify(achievementsData));
    console.log('Progress saved to localStorage');
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

// ============================================
// LOAD PROGRESS FROM LOCALSTORAGE
// ============================================

function loadProgress() {
  try {
    const saved = localStorage.getItem('achievementProgress');
    if (saved) {
      achievementsData = JSON.parse(saved);
      console.log('Progress loaded from localStorage');
      return true;
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return false;
}

// ============================================
// RESET PROGRESS (Optional - for testing)
// ============================================

function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    localStorage.removeItem('achievementProgress');
    location.reload();
  }
}

// ============================================
// GET PROGRESS STATISTICS
// ============================================

function getProgressStats() {
  if (!achievementsData) return null;
  
  const stats = {
    total: 0,
    completed: 0,
    locked: 0,
    available: 0,
    totalPoints: 0,
    earnedPoints: 0,
    byPlanet: {}
  };
  
  achievementsData.planets.forEach(planet => {
    const planetStats = {
      total: 0,
      completed: 0,
      locked: 0,
      available: 0
    };
    
    planet.tiers.forEach(tier => {
      tier.achievements.forEach(achievement => {
        stats.total++;
        planetStats.total++;
        stats.totalPoints += achievement.points || 0;
        
        if (achievement.status === 'completed') {
          stats.completed++;
          planetStats.completed++;
          stats.earnedPoints += achievement.points || 0;
        } else if (achievement.status === 'locked') {
          stats.locked++;
          planetStats.locked++;
        } else {
          stats.available++;
          planetStats.available++;
        }
      });
    });
    
    stats.byPlanet[planet.planetName] = planetStats;
  });
  
  stats.percentage = ((stats.completed / stats.total) * 100).toFixed(1);
  
  return stats;
}

// ============================================
// EXPORT FUNCTIONS FOR CONSOLE USE
// ============================================

// You can call these from the browser console for testing:
window.unlockAchievement = unlockAchievement;
window.resetProgress = resetProgress;
window.getProgressStats = getProgressStats;
window.achievementsData = achievementsData;

console.log('Achievement System Ready!');
console.log('Available console commands:');
console.log('- unlockAchievement("achievement_id")');
console.log('- getProgressStats()');
console.log('- resetProgress()');
