import React, { useState, useEffect } from 'react';
import axios from 'axios';
import goldCrown from '../icons/goldCrown.svg';
import silverCrown from '../icons/silverCrown.svg';
import bronzeCrown from '../icons/bronzeCrown.svg';
import podioImage from '../icons/podio.jpeg'; // Atualizado para incluir a imagem do pódio

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [victoryBarHeights, setVictoryBarHeights] = useState({});
  const [lastChampion, setLastChampion] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]); // Para armazenar todos os jogadores

  // Fetch ranking data and process player list
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('https://brawlhalla-championship-backend.onrender.com/users');
        const players = response.data;
        console.log("Ranking data:", players);

        setAllPlayers(players); // Armazenar todos os jogadores
        
        const sortedRanking = players.sort((a, b) => a.victorys - b.victorys);
        const newRank = [];
        for (let i = sortedRanking.length - 1; i >= 0; i--) {
          if (i % 2 === 0) {
            newRank.push(sortedRanking[i]);
          } else {
            newRank.unshift(sortedRanking[i]);
          }
        }

        if (newRank[3].victorys < newRank[5].victorys) {
          const position4 = newRank[3];
          const position6 = newRank[5];
          newRank[3] = position6;
          newRank[5] = position4;
        }
        
        setRanking(newRank);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.log(err.message);
      }
    };

    const fetchLastChampion = async () => {
      try {
        const response = await axios.get('https://brawlhalla-championship-backend.onrender.com/championship/last-champion');
        console.log("Last champion data:", response.data);

        setLastChampion(response.data.champion);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      }
    };

    fetchRanking();
    fetchLastChampion();
  }, []);

  // Update victory bar heights when ranking changes
  useEffect(() => {
    if (allPlayers.length > 0) {
      const maxVictories = Math.max(...allPlayers.map(player => player.victorys));
      const isSmallScreen = window.innerWidth < 1400;
      const scaleFactor = isSmallScreen ? 25 : 30;
      const heights = allPlayers.reduce((acc, player) => {
        acc[player.id] = (player.victorys / maxVictories) * scaleFactor;
        return acc;
      }, {});
      setVictoryBarHeights(heights);
    }
  }, [allPlayers]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.fileira}>
      <div style={styles.container}>
        <div style={styles.sectionCenter}>
          {ranking.map((player, index) => {
            const showCrown =
              (index === 4 && player.victorys > 0) ||
              (index === 3 && player.victorys > 0 && ranking[4].victorys > player.victorys) ||
              (index === 5 && player.victorys > 0 && ranking[3].victorys > player.victorys);

            return (
              <div key={player.id} style={styles.player}>
                {showCrown && index === 4 && <img src={goldCrown} alt="Coroa de Ouro" style={styles.crownGold} />}
                {showCrown && index === 3 && <img src={silverCrown} alt="Coroa de Prata" style={styles.crownSilver} />}
                {showCrown && index === 5 && <img src={bronzeCrown} alt="Coroa de Bronze" style={styles.crownBronze} />}
                <img
                  src={player.avatar_url}
                  alt={player.name}
                  style={styles.avatar}
                />
                <div style={styles.details}>
                  <h2 style={styles.name}>{player.name}</h2>
                  <p style={styles.victories}>{player.victorys} wins</p>
                  <div style={{ ...styles.animationBar, height: `${victoryBarHeights[player.id] || 0}rem` }}></div>
                </div>
              </div>
            );
          })}
        </div>
        {lastChampion && (
          <div
            style={{
              ...styles.championContainer,
              backgroundImage: `url(${podioImage})`, // Adiciona a imagem de fundo
            }}
          >
            <div style={styles.overlay}></div> {/* Imagem preta adicionada */}
            <h3 style={styles.championTitle}>Último Campeão</h3>
            <div style={styles.championAvatarContainer}>
              <img src={lastChampion.avatar_url} alt={lastChampion.name} style={styles.championAvatar} />
            </div>
            <h4 style={styles.championName}>{lastChampion.name}</h4>
          </div>
        )}
      </div>    
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',

  },
  sectionLeft: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '40px',
    width: '320px',
    padding: '1px',
    position: 'relative',
  },
  sectionCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '35px',
    flex: 1,
    padding: '1px',
    borderRadius: '10px',
    position: 'relative',
  },
  sectionRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '60px',
    width: '400px',
    padding: '1px',
    borderRadius: '10px',
    position: 'relative',
  },
  player: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '5px',
    border: '3px solid black',
  },
  details: {
    textAlign: 'center',
    color: '#000000',
  },
  name: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0',
  },
  victories: {
    fontSize: '15px',
    color: '#000000',
    fontWeight: 'bold',
    margin: '0',
    marginTop: '5px',
  },
  animationBar: {
    width: '90px',
    height: 0,
    backgroundColor: '#730065',
    transition: 'height 1s ease-in-out',
    marginTop: '5px',
    borderRadius: '12px 12px 0px 0px'
  },
  crownGold: {
    position: 'absolute',
    top: '-47px',
    left: '34%',
    transform: 'translateX(-50%) rotate(-15deg)',
    width: '60px',
    height: 'auto',
  },
  crownSilver: {
    position: 'absolute',
    top: '-49px',
    left: '64%',
    transform: 'translateX(-50%) rotate(-10deg)',
    width: '60px',
    height: 'auto',
  },
  crownBronze: {
    position: 'absolute',
    top: '-45px',
    left: '27%',
    transform: 'translateX(-50%) rotate(10deg)',
    width: '60px',
    height: 'auto',
  },
  championContainer: {
    position: 'fixed',
    bottom: '65%',
    left: '85%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '90px 90px',
    border: '3px solid #FF0000',
    boxShadow: '0 0 10px #FF0000', 
    borderRadius: '10px',
    margin: '20px auto',
    maxWidth: '300px',
    color: '#fff', // Cor do texto para contraste
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  championTitle: {
    position: 'absolute',
    fontSize: '15px',
    bottom: '150px',
    fontWeight: 'bold',
    margin: '0',
  },
  championAvatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    Top: '50%',
    marginBottom: '-7px',
  },
  championAvatar: {
    position: "absolute",
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginTop: '-25%',
    border: '3px solid #FF0000',
    boxShadow: '0 0 10px #FF0000', 
  },
  championName: {
    position: 'absolute',
    fontSize: '15px',
    bottom: '1px',
    fontWeight: 'bold',
    color: '#fff', // Cor do texto para contraste
    margin: '0',
  },
};

export default Ranking;
