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

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('https://brawlhalla-championship-backend.onrender.com/users');
        const players = response.data;
        console.log("Ranking data:", players);

        const sortedRanking = players.sort((a, b) => b.victorys - a.victorys);

        setRanking(sortedRanking);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchLastChampion = async () => {
      try {
        const response = await axios.get('https://brawlhalla-championship-backend.onrender.com/championship/last-champion');
        console.log("Last champion data:", response.data);

        // Ajustar para acessar a propriedade correta
        setLastChampion(response.data.champion);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRanking();
    fetchLastChampion();
  }, []);

  useEffect(() => {
    if (ranking.length > 0) {
      const maxVictories = Math.max(...ranking.map(player => player.victorys));
      const heights = ranking.reduce((acc, player) => {
        acc[player.id] = (player.victorys / maxVictories) * 27;
        return acc;
      }, {});
      setVictoryBarHeights(heights);
    }
  }, [ranking]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const topPlayers = ranking.slice(0, 3);
  const leftPlayers = ranking.slice(3, 6);
  const rightPlayers = ranking.slice(6, 9);

  return (
    <div style={styles.container}>
      <div style={styles.fileira}>
        <div style={styles.sectionLeft}>
          {leftPlayers.map(player => (
            <div key={player.id} style={styles.player}>
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
          ))}
        </div>

        <div style={styles.sectionCenter}>
          {topPlayers.map((player, index) => {
            const showCrown =
              (index === 0 && player.victorys > 0) ||
              (index === 1 && player.victorys > 0 && topPlayers[0].victorys > player.victorys) ||
              (index === 2 && player.victorys > 0 && topPlayers[1].victorys > player.victorys);

            return (
              <div key={player.id} style={styles.player}>
                {showCrown && index === 0 && <img src={goldCrown} alt="Coroa de Ouro" style={styles.crownGold} />}
                {showCrown && index === 1 && <img src={silverCrown} alt="Coroa de Prata" style={styles.crownSilver} />}
                {showCrown && index === 2 && <img src={bronzeCrown} alt="Coroa de Bronze" style={styles.crownBronze} />}
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

        <div style={styles.sectionRight}>
          {rightPlayers.map(player => (
            <div key={player.id} style={styles.player}>
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
          ))}
        </div>
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
  fileira: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    maxWidth: '1200px',
    margin: 'auto',
    gap: '50px',
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
    gap: '60px',
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
    width: '70px',
    height: 0,
    backgroundColor: '#730065',
    transition: 'height 1s ease-in-out',
    marginTop: '5px',
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
    padding: '20px',
    border: '3px solid gold',
    borderRadius: '10px',
    margin: '20px auto',
    maxWidth: '300px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Escurecer ainda mais o fundo
    color: '#fff', // Cor do texto para contraste
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  championTitle: {
    fontSize: '24px',
    marginBottom: '40px',
    fontWeight: 'bold',
    margin: '0',
  },
  championAvatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
  },
  championAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '3px solid gold',
  },
  championName: {
    fontSize: '20px',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#fff', // Cor do texto para contraste
    margin: '0',
  },
};

export default Ranking;
