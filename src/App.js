import logo from './logo.svg';
import './App.css';
import {useQuery, gql} from "@apollo/client";
import { Line } from 'react-chartjs-2';


const VIEWER = gql`{
  viewer {
    name
    login
    bio
    avatarUrl(size: 0)
    repositories(first: 10) {
      totalCount
      nodes {
        object(expression: "main") {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
        updatedAt
      }
    }
    followers {
      totalCount
    }
    following {
      totalCount
    }
  }
}
`;

const UserPres = ({ user: { name, bio, login, avatarUrl, followers, repositories, following } }) => (
  <div> 
    <div className='row'>
      <p>Share your profile on: 
      <br/>
      liste de truc</p> 
      <div className='col'>
        <h1>{name}</h1>
      </div>
      <div className='col'>
        <p>{bio}</p>
      </div>
    </div>
    <div className='row'>
      <p>{login}</p>
      <div className='col'>
        <img src={avatarUrl} width='100' height='100' className='rounded-circle'/>  
      </div>
      <div className='col'>
        <p>commits</p>
        <p>{CommitSum()}</p>
      </div>
      <div className='col'>
        <p>repos</p>
        <p>{ repositories.totalCount }</p>
      </div>
      <div className='col'>
        <p>Lines of codes</p>
        <p>NaN</p>
      </div>
      <div className='col'>
        <p>followers</p>
        <p>{ followers.totalCount == null ? '0' : followers.totalCount }</p>
      </div>
      <div className='col'>
        <p>following</p>
        <p>{ following.totalCount == null ? '0' : following.totalCount }</p>
      </div>
      <div className='col'>
        <p>Refresh</p>
        <p>NaN</p>
      </div>
    </div>
  </div>
)

const Overview = ({ user : { repositories } }) => (
  <div className='overview-section'>
    <div className='row mt-5'>
      <div className='col'>
        <h2>Overview</h2>
      </div>
      <div className='col'>
        <p>{repositories.totalCount} repos <br/> Last updated: {LastUpdate()}</p>
      </div>
    </div>
    <div className='row'>
        <div className='col'>
          <Line
            data ={{
              labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
              datasets: [
                {
                  label: '# of Votes',
                  data: [12, 19, 3, 5, 2, 3],
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  fill: true
                }
                ]
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
    </div>
  </div>
)

function CommitSum() {
  const { loading, error, data } = useQuery(VIEWER);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  var sum = 0
  data.viewer.repositories.nodes.forEach(repository => {
    if(repository.object != null){
      sum += repository.object.history.totalCount
    }  
  });
  return sum
}

function LastUpdate() {
  const { loading, error, data } = useQuery(VIEWER);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
    var allDate = []
  
    data.viewer.repositories.nodes.forEach(repository => {
    allDate.push(Date.parse(repository.updatedAt))
  });
  var date = new Date(Math.max(...allDate))
  var dateString = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay() + ' ' + date.getHours() +':'+ date.getMinutes() + ':' + date.getSeconds()
  return dateString
}

const Languages = ({user: { repositories } }) => (
  <div className='Languages-section'>
    <div className='row mt-5'>
      <div className='col'>
        <h2>Languages</h2>
      </div>
      <div className='col'>
        <p>{repositories.totalCount} repos <br/> Last updated: {LastUpdate()}</p>
      </div>
    </div>
    <div className='row'>
      <div className='col'>
        {repositories.nodes.map( (r) => <li key={r.updatedAt}>{r.updatedAt}</li>)}
      </div>
    </div>
  </div>
)

function App() {
  const { loading, error, data } = useQuery(VIEWER);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <main className='App-test'>
      <div className='container'>
        <div className='profil-section'>
          <div className='row justify-content-center'>
            <div className='col-7'>
              <UserPres user={data.viewer}/>
              <Overview user={data.viewer}/>
              <Languages user={data.viewer}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
